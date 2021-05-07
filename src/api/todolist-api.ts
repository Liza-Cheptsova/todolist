import axios from "axios";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "94c9f385-f2db-498c-b99f-a10b7cce6547",
  },
});

type TodolistsType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};

type ResponceType = {
  resultCode: number;
  messages: Array<string>;
  data: {
    item: TodolistsType;
  };
};

export const todolistAPI = {
  getTodolist() {
    return instance.get<Array<ResponceType>>(`todo-lists`);
  },

  addTodolist(title: string) {
    return instance.post<ResponceType>(`todo-lists`, { title: title });
  },

  updateTodolist(todolistId: string, title: string) {
    return instance.put<ResponceType>(`todo-lists/${todolistId}`, { title: title });
  },

  deleteTodoist(todolistId: string) {
    return instance.delete<ResponceType>(`todo-lists/${todolistId}`);
  },
};
