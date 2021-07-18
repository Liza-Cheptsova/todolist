import { CircularProgress, Container, Grid } from "@material-ui/core";
import "./App.css";
import { Header } from "./components/header/Header";
import { ErrorSnackbar } from "./components/errorSnackbar/ErrorSnackbar";
import { Redirect, Route, Switch } from "react-router-dom";
import { Login } from "./components/features/login/Login";
import { TodolistsList } from "./components/todolists/TodolistsList";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeAppTC } from "./state/reducers/auth-reducer";
import { RootStateType } from "./state/store";

export const App = () => {
  const isInitialized = useSelector<RootStateType>((state) => state.auth.isInitialized);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAppTC());
  }, []);

  // if (!isInitialized) {
  //   return (
  //     <div style={{ position: "fixed", top: "50%", textAlign: "center", width: "100%" }}>
  //       <CircularProgress />
  //     </div>
  //   );
  // }

  return (
    <div className="App">
      <ErrorSnackbar />
      <Header />
      <Container fixed className={"container"}>
        <Grid container justify="center" spacing={4}>
          <Switch>
            <Route exact path={"/"} render={() => <TodolistsList />} />
            <Route path={"/login"} render={() => <Login />} />
            <Route path={"/404"} render={() => <h1>404: PAGE NOT FOUND</h1>} />
            <Redirect from={"*"} to={"/404"} />
          </Switch>
        </Grid>
      </Container>
    </div>
  );
};
