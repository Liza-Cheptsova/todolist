import axios from "axios";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1//todo-lists/",
  withCredentials: true,
  headers: {
    "API-KEY": "94c9f385-f2db-498c-b99f-a10b7cce6547",
  },
});

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TaskType = {
  description: string;
  title: string;
  completed: boolean;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: null | string;
  deadline: null | string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};

export type GetTasksType = {
  error: string | null;
  totalCount: number;
  items: Array<TaskType>;
};

export type UpdateTaskModelType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  deadline: null | string;
  startDate: null | string;
};

export type ResponceTaskType = {
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

  updateTask(todolistId: string, taskId: string, modal: UpdateTaskModelType) {
    return instance.put<ResponceTaskType>(`${todolistId}/tasks/${taskId}`, modal);
  },

  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponceTaskType>(`${todolistId}/tasks/${taskId}`);
  },
};
