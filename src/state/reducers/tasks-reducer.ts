import { TaskStateType } from "../../App";
import { v1 } from "uuid";
import { AddTodolistAT, RemoveTodolistAT, SetTodolistType, todolistId1, todolistId2 } from "./todolist-reducer";
import { taskAPI, TaskPriorities, TaskStatuses, TaskType } from "../../api/tasks-api";
import { Dispatch } from "redux";
import { RootStateType } from "../store";

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

    default:
      return state;
  }
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
  | SetTaskType
  | RemoveTodolistAT
  | AddTodolistAT
  | SetTodolistType;

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

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  taskAPI.getTasks(todolistId).then((res) => {
    const tasks = res.data.items;
    dispatch(setTasksAC(tasks, todolistId));
  });
};

export const deleteTaskThunk = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  taskAPI.deleteTask(todolistId, taskId).then((res) => dispatch(removeTaskAC(todolistId, taskId)));
};

export const addTaskThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  taskAPI.addTask(todolistId, title).then((res) => {
    const task = res.data.data.item;
    dispatch(addTaskAC(task));
  });
};

export type UpdateDomainTaskModelType = {
  description?: string;
  title?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  deadline?: null | string;
  startDate?: null | string;
};

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => {
  return (dispatch: Dispatch, getState: () => RootStateType) => {
    // так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
    // те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва

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
          // const updateSatus = res.data.data.item.status
          dispatch(updateTaskAC(taskId, domainModel, todolistId));
        });
    }
  };
};
