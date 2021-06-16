import { v1 } from "uuid";
import { AddTodolistAT, RemoveTodolistAT, SetTodolistType, todolistId1 } from "./todolist-reducer";
import { taskAPI, TaskPriorities, TaskStatuses, TaskType } from "../../api/tasks-api";
import { Dispatch } from "redux";
import { RootStateType } from "../store";
import { RequestStatusType, SetAppStatus } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";

const initialState: TaskStateType = {
  [todolistId1]: [
    {
      id: v1(),
      title: "HTML",
      status: TaskStatuses.Completed,
      description: "",
      completed: false,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todolistId1,
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
  ],
};

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsTypes): TaskStateType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      const stateCopy = { ...state };
      const tasks = state[action.todolistId];
      stateCopy[action.todolistId] = tasks.filter((t) => t.id !== action.taskId);
      return stateCopy;
    }

    case "ADD-TASK": {
      const stateCopy = { ...state };
      let newTask = action.task;
      let task = stateCopy[newTask.todoListId];
      const newTasks = [newTask, ...task];
      stateCopy[newTask.todoListId] = newTasks;
      return stateCopy;
    }

    case "SET-TASK": {
      const stateCopy = { ...state };
      stateCopy[action.todolistId] = action.tasks;
      return stateCopy;
    }

    case "UPDATE-TASK": {
      const stateCopy = { ...state };
      let tasks = stateCopy[action.todolistId];
      stateCopy[action.todolistId] = tasks.map((t) => (t.id === action.taskId ? { ...t, ...action.model } : t));

      return stateCopy;
    }

    case "NEW-TASK-TITLE": {
      const stateCopy = { ...state };
      stateCopy[action.todolistId] = stateCopy[action.todolistId].map((t) =>
        t.id === action.taskId ? { ...t, title: action.newTitle } : t
      );
      return stateCopy;
    }

    case "ADD-TODOLIST": {
      return {
        ...state,
        [action.todolist.id]: [],
      };
    }

    case "REMOVE-TODOLIST": {
      const stateCopy = { ...state };
      delete stateCopy[action.id];
      return stateCopy;
    }

    case "SET-TODOLIST": {
      const stateCopy = { ...state };
      action.todolists.forEach((tl) => {
        stateCopy[tl.id] = [];
      });
      return stateCopy;
    }

    case "SET-TASK-ENTITY-STATUS": {
      const stateCopy = { ...state };
      stateCopy[action.todolistId] = stateCopy[action.todolistId].map((t) =>
        t.id === action.taskId ? { ...t, entityStatus: action.entityStatus } : t
      );
      return stateCopy;
    }

    default:
      return state;
  }
};

//actions
export const removeTaskAC = (todolistId: string, taskId: string) => {
  return { type: "REMOVE-TASK", taskId, todolistId } as const;
};

export const addTaskAC = (task: TaskType) => {
  return { type: "ADD-TASK", task } as const;
};

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => {
  return { type: "UPDATE-TASK", taskId, model, todolistId } as const;
};

export const newTaskTitleAC = (taskId: string, newTitle: string, todolistId: string) => {
  return { type: "NEW-TASK-TITLE", taskId, newTitle, todolistId } as const;
};

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTaskType => {
  return { type: "SET-TASK", tasks, todolistId };
};

export const setTaskEntityStatus = (todolistId: string, taskId: string, entityStatus: RequestStatusType) => {
  return { type: "SET-TASK-ENTITY-STATUS", todolistId, taskId, entityStatus } as const;
};

//thunk
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatus("loading"));
  taskAPI.getTasks(todolistId).then((res) => {
    const tasks = res.data.items;
    dispatch(setTasksAC(tasks, todolistId));
    dispatch(SetAppStatus("succeeded"));
  });
};

export const deleteTaskThunk = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatus("loading"));
  dispatch(setTaskEntityStatus(todolistId, taskId, "loading"));
  taskAPI
    .deleteTask(todolistId, taskId)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(removeTaskAC(todolistId, taskId));
        dispatch(SetAppStatus("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export const addTaskThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatus("loading"));
  taskAPI
    .addTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(addTaskAC(task));
        dispatch(SetAppStatus("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => {
  return (dispatch: Dispatch, getState: () => RootStateType) => {
    dispatch(SetAppStatus("loading"));
    const task = getState().tasks[todolistId].find((t) => t.id === taskId);
    if (task) {
      taskAPI
        .updateTask(todolistId, taskId, {
          title: task.title,
          startDate: task.startDate,
          priority: task.priority,
          description: task.description,
          deadline: task.deadline,
          status: task.status,
          ...domainModel,
        })
        .then((res) => {
          if (res.data.resultCode === 0) {
            dispatch(updateTaskAC(taskId, domainModel, todolistId));
            dispatch(SetAppStatus("succeeded"));
          } else {
            handleServerAppError(res.data, dispatch);
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch);
        });
    }
  };
};

//types
export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

export type UpdateDomainTaskModelType = {
  description?: string;
  title?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  deadline?: null | string;
  startDate?: null | string;
};

type SetTaskType = {
  type: "SET-TASK";
  tasks: Array<TaskType>;
  todolistId: string;
};

export type ActionsTypes =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof newTaskTitleAC>
  | ReturnType<typeof setTaskEntityStatus>
  | SetTaskType
  | RemoveTodolistAT
  | AddTodolistAT
  | SetTodolistType;
