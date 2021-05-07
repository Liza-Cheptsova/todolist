import axios from "axios";
import { NullLiteral } from "typescript";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1//todo-lists/",
  withCredentials: true,
  headers: {
    "API-KEY": "94c9f385-f2db-498c-b99f-a10b7cce6547",
  },
});

type TaskType = {
  description: string;
  title: string;
  completed: boolean;
  status: number;
  priority: number;
  startDate: null | string;
  deadline: null | string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};

type GetTasksType = {
  error: string | null;
  totalCount: number;
  items: Array<TaskType>;
};

type ResponceTaskType = {
  resultCode: number;
  messages: Array<string>;
  data: { item: TaskType };
};

export const taskAPI = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksType>(`${todolistId}/tasks`);
  },

  addTask(todolistId: string, title: string) {
    return instance.post<ResponceTaskType>(`${todolistId}/tasks`, { title: title });
  },

  updateTask(todolistId: string, taskId: string, title: string) {
    return instance.put<ResponceTaskType>(`${todolistId}/tasks/${taskId}`, { title: title });
  },

  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponceTaskType>(`${todolistId}/tasks/${taskId}`);
  },
};
