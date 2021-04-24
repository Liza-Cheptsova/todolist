import React, {useCallback} from 'react';
import './App.css';
import {TaskType, Todolist} from "./components/todolists/Todolist";
import {Title} from "./components/formItems/Title";
import {Container, Grid,  Paper} from "@material-ui/core";
import {
    addTodolistAC,
    changeTodolistFilterAC, changeTodolistTitleAC,
    removeTodolistAC,
} from "./state/reducers/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "./state/store";
import {Header} from "./components/header/Header";

export type FilterValuesType = "all" | "completed" | "active"

export type TodolistsType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

export const App = () => {


    const todolists = useSelector<RootStateType, Array<TodolistsType>>(state => state.todolists)
    const dispatch = useDispatch()


    let removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistAC(id))
    }, [dispatch])

    let changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(value, todolistId))
    }, [dispatch])

    let addNewTodolist = useCallback((title: string) => {
       dispatch(addTodolistAC(title))
    }, [dispatch])

    let newTodolistTitle = useCallback((id: string, newTitle: string) => {
       dispatch(changeTodolistTitleAC(id, newTitle))
    }, [dispatch])

    return (
        <div className="App">
            <Header/>
            <Container fixed>
                <Grid container style={{padding: "20px 0"}}>
                    <Title addTask={addNewTodolist}/>
                </Grid>

                <Grid container spacing={4}>
                    {
                        todolists.map((tl) => {

                            return <Grid item>
                                <Paper style={{padding: "10px"}} elevation={3}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        removeTodolist={removeTodolist}
                                        changeFilter={changeFilter}
                                        newTodolistTitle={newTodolistTitle}
                                        filter={tl.filter}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}
