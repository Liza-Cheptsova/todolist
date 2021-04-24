import {FilterValuesType, TodolistsType} from "../../App";
import {v1} from "uuid";

export type RemoveTodolistAT = {
    type: 'REMOVE-TODOLIST'
    id: string
}

export type AddTodolistAT = {
    type: 'ADD-TODOLIST'
    title: string
    todolistId: string
}

type ChangeTodolistTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}

type ChangeTodolistFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}

export type ActionsTypes = RemoveTodolistAT | AddTodolistAT | ChangeTodolistTitleAT | ChangeTodolistFilterAT

export const todolistId1 = v1();
export const todolistId2 = v1();


const initialState: Array<TodolistsType> = []

export const todolistReducer = (state: Array<TodolistsType> = initialState, action: ActionsTypes) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {

            return state.filter(tl => tl.id !== action.id)
        }

        case 'ADD-TODOLIST': {

            return [...state, {id: action.todolistId, title: action.title, filter: 'all'}]

        }

        case 'CHANGE-TODOLIST-TITLE': {

            let newTodolistTitle = state.find(tl => tl.id === action.id);
            if (newTodolistTitle) {
                newTodolistTitle.title = action.title;
            }

            return [...state]
        }

        case 'CHANGE-TODOLIST-FILTER': {

            let todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;
            }

            return [...state]

        }


        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistAT => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}

export const addTodolistAC = (title: string): AddTodolistAT => {
    return {type: 'ADD-TODOLIST', title: title, todolistId: v1()}
}

export const changeTodolistTitleAC = (todolistId: string, title: string): ChangeTodolistTitleAT => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: todolistId, title: title}
}

export const changeTodolistFilterAC = (filter: FilterValuesType, todolistId: string): ChangeTodolistFilterAT => {
    return {type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId}
}
