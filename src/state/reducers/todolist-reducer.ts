import { Dispatch } from "redux";
import { v1 } from "uuid";
import { TodolistsType } from "../../api/todolist-api";
import { todolistAPI } from "./../../api/todolist-api";
export type FilterValuesType = "all" | "completed" | "active";
export type TodolistDomainType = TodolistsType & {
  filter: FilterValuesType;
};

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
      const newTodolist: TodolistDomainType = { ...action.todolist, filter: "all" };
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
      }));
    }

    default:
      return state;
  }
};

export type ActionsTypes =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof setTodolistAC>;

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

export const fetchTodolistsThunk = () => (dispatch: Dispatch) => {
  todolistAPI.getTodolist().then((res) => {
    dispatch(setTodolistAC(res.data));
  });
};

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistAPI.deleteTodoist(todolistId).then((res) => {
    dispatch(removeTodolistAC(todolistId));
  });
};

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  todolistAPI.addTodolist(title).then((res) => {
    const newTitle = res.data.data.item;
    dispatch(addTodolistAC(newTitle));
  });
};

export const updateTodolistTitle = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todolistAPI.updateTodolist(todolistId, title).then((res) => {
    dispatch(changeTodolistTitleAC(todolistId, title));
  });
};
