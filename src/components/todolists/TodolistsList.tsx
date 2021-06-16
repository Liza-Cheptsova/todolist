import { Container, Grid, Paper } from "@material-ui/core";
import React from "react";
import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  addTodolistTC,
  changeTodolistFilterAC,
  deleteTodolistTC,
  fetchTodolistsThunk,
  FilterValuesType,
  TodolistDomainType,
  updateTodolistTitle,
} from "../../state/reducers/todolist-reducer";
import { RootStateType } from "../../state/store";
import { Title } from "../formItems/Title";
import { Todolist } from "./Todolist";

export const TodolistsList = () => {
  const todolists = useSelector<RootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchTodolistsThunk());
  }, [dispatch]);

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

  const isLoggedIn = useSelector<RootStateType, boolean>((state) => state.auth.isLoggedIn);
  if (!isLoggedIn) {
    return <Redirect to={"/login"} />;
  }

  return (
    <>
      <Container fixed>
        <Grid container style={{ padding: "20px 0" }}>
          <Title addTask={addNewTodolist} />
        </Grid>
        <Grid container spacing={4}>
          {todolists.map((tl) => {
            return (
              <Grid item key={tl.id}>
                <Paper style={{ padding: "10px" }} elevation={3}>
                  <Todolist
                    key={tl.id}
                    todolist={tl}
                    removeTodolist={removeTodolist}
                    changeFilter={changeFilter}
                    newTodolistTitle={newTodolistTitle}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};
