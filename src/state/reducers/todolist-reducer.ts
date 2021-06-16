import { Dispatch } from "redux";
import { v1 } from "uuid";
import { TodolistsType } from "../../api/todolist-api";
import { todolistAPI } from "./../../api/todolist-api";
import { RequestStatusType, SetAppStatus } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "./../../utils/error-utils";

export const todolistId1 = v1();
export const todolistId2 = v1();

const initialState: Array<TodolistDomainType> = [];

export const todolistReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsTypes
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.id);
    }

    case "ADD-TODOLIST": {
      const newTodolist: TodolistDomainType = { ...action.todolist, filter: "all", entityStatus: "idle" };
      return [newTodolist, ...state];
    }

    case "CHANGE-TODOLIST-TITLE": {
      let newTodolistTitle = state.find((tl) => tl.id === action.id);
      if (newTodolistTitle) {
        newTodolistTitle.title = action.title;
      }
      return [...state];
    }

    case "CHANGE-TODOLIST-FILTER": {
      let todolist = state.find((tl) => tl.id === action.id);
      if (todolist) {
        todolist.filter = action.filter;
      }
      return [...state];
    }

    case "SET-TODOLIST": {
      return action.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    }

    case "CHANGE-TODOLIST-ENTITY-STATUS": {
      return state.map((tl) => (tl.id === action.id ? { ...tl, entityStatus: action.entityStatus } : tl));
    }

    default:
      return state;
  }
};

//actions
export const removeTodolistAC = (todolistId: string) => {
  return { type: "REMOVE-TODOLIST", id: todolistId } as const;
};

export const addTodolistAC = (todolist: TodolistsType) => {
  return { type: "ADD-TODOLIST", todolist } as const;
};

export const changeTodolistTitleAC = (todolistId: string, title: string) => {
  return { type: "CHANGE-TODOLIST-TITLE", id: todolistId, title: title } as const;
};

export const changeTodolistFilterAC = (filter: FilterValuesType, todolistId: string) => {
  return { type: "CHANGE-TODOLIST-FILTER", filter: filter, id: todolistId } as const;
};

export const setTodolistAC = (todolists: Array<TodolistsType>) => {
  return { type: "SET-TODOLIST", todolists } as const;
};

export const setTodolistchangeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => {
  return { type: "CHANGE-TODOLIST-ENTITY-STATUS", id, entityStatus } as const;
};

//thunk
export const fetchTodolistsThunk = () => (dispatch: Dispatch) => {
  dispatch(SetAppStatus("loading"));
  todolistAPI
    .getTodolist()
    .then((res) => {
      dispatch(setTodolistAC(res.data));
      dispatch(SetAppStatus("succeeded"));
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatus("loading"));
  dispatch(setTodolistchangeTodolistEntityStatusAC(todolistId, "loading"));
  todolistAPI
    .deleteTodoist(todolistId)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(removeTodolistAC(todolistId));
        dispatch(SetAppStatus("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatus("loading"));
  todolistAPI
    .addTodolist(title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        const newTitle = res.data.data.item;
        dispatch(addTodolistAC(newTitle));
        dispatch(SetAppStatus("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export const updateTodolistTitle = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatus("loading"));
  todolistAPI
    .updateTodolist(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(changeTodolistTitleAC(todolistId, title));
        dispatch(SetAppStatus("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

//types
export type ActionsTypes =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof setTodolistAC>
  | ReturnType<typeof setTodolistchangeTodolistEntityStatusAC>;

export type RemoveTodolistAT = {
  type: "REMOVE-TODOLIST";
  id: string;
};

export type AddTodolistAT = {
  type: "ADD-TODOLIST";
  todolist: TodolistsType;
};

export type SetTodolistType = {
  type: "SET-TODOLIST";
  todolists: Array<TodolistsType>;
};

export type FilterValuesType = "all" | "completed" | "active";

export type TodolistDomainType = TodolistsType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
