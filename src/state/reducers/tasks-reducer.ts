import {TaskStateType} from "../../App";
import {v1} from "uuid";
import {
    AddTodolistAT,
    RemoveTodolistAT,
    todolistId1,
    todolistId2
} from "./todolist-reducer";

type RemoveTaskAT = {
    type: 'REMOVE-TASK'
    taskId: string
    todolistId: string
}

type AddTaskAT = {
    type: 'ADD-TASK'
    taskTitle: string
    todolistId: string
}

type ChangeStatusAT = {
    type: 'CHANGE-STATUS'
    taskId: string
    isDone: boolean
    todolistId: string
}

type NewTaskTitleAT = {
    type: 'NEW-TASK-TITLE'
    taskId: string
    newTitle: string
    todolistId: string
}

export type ActionsTypes = RemoveTaskAT | AddTaskAT | ChangeStatusAT | NewTaskTitleAT | AddTodolistAT | RemoveTodolistAT


const initialState: TaskStateType = {

    [todolistId1]: [
        {id: v1(), title: "HTML", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "React", isDone: false}
    ],

    [todolistId2]: [
        {id: v1(), title: "rest api", isDone: false},
        {id: v1(), title: "graphQL", isDone: false}
    ]
}

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsTypes): TaskStateType => {
    switch (action.type) {

        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todolistId];
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId)
            return stateCopy
        }

        case "ADD-TASK": {
            const stateCopy = {...state}
            let task = {id: v1(), title: action.taskTitle, isDone: false}
            let newTask = state[action.todolistId];
            stateCopy[action.todolistId] = [task, ...newTask]
            return stateCopy
        }

        case "CHANGE-STATUS": {
            const stateCopy = {...state}
             let tasks = stateCopy[action.todolistId]
            stateCopy[action.todolistId] = tasks.map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t)

            return stateCopy
        }

        case "NEW-TASK-TITLE": {
            const stateCopy = {...state};
            stateCopy[action.todolistId] = stateCopy[action.todolistId].map(t => t.id === action.taskId ? {...t, title: action.newTitle} : t)
            return stateCopy
        }

        case "ADD-TODOLIST": {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = []
            return stateCopy
        }

        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }

        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskAT => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}

export const addTaskAC = (taskTitle: string, todolistId: string): AddTaskAT => {
    return {type: 'ADD-TASK', taskTitle, todolistId}
}

export const changeStatusAC = (taskId: string, isDone: boolean, todolistId: string): ChangeStatusAT => {
    return {type: 'CHANGE-STATUS', taskId, isDone, todolistId}
}

export const newTaskTitleAC = (taskId: string, newTitle: string, todolistId: string): NewTaskTitleAT => {
    return {type: 'NEW-TASK-TITLE', taskId, newTitle, todolistId}
}
