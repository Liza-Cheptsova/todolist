import { Container, Grid, Paper } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TaskType } from "./api/tasks-api";
import "./App.css";
import { Title } from "./components/formItems/Title";
import { Header } from "./components/header/Header";
import { Todolist } from "./components/todolists/Todolist";
import {
  addTodolistAC,
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  deleteTodolistTC,
  fetchTodolistsThunk,
  FilterValuesType,
  removeTodolistAC,
  setTodolistAC,
  TodolistDomainType,
  updateTodolistTitle,
} from "./state/reducers/todolist-reducer";
import { RootStateType } from "./state/store";

export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

export const App = () => {
  const todolists = useSelector<RootStateType, Array<TodolistDomainType>>((state) => state.todolists);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodolistsThunk());
  }, []);

  let removeTodolist = useCallback(
    (id: string) => {
      dispatch(deleteTodolistTC(id));
    },
    [dispatch]
  );

  let changeFilter = useCallback(
    (value: FilterValuesType, todolistId: string) => {
      dispatch(changeTodolistFilterAC(value, todolistId));
    },
    [dispatch]
  );

  let addNewTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );

  let newTodolistTitle = useCallback(
    (id: string, newTitle: string) => {
      dispatch(updateTodolistTitle(id, newTitle));
    },
    [dispatch]
  );

  return (
    <div className='App'>
      <Header />
      <Container fixed>
        <Grid container style={{ padding: "20px 0" }}>
          <Title addTask={addNewTodolist} />
        </Grid>

        <Grid container spacing={4}>
          {todolists.map((tl) => {
            return (
              <Grid item>
                <Paper style={{ padding: "10px" }} elevation={3}>
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
            );
          })}
        </Grid>
      </Container>
    </div>
  );
};
