import React from "react";
import { AppBar, Button, IconButton, LinearProgress, Toolbar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useDispatch, useSelector } from "react-redux";
import { RequestStatusType } from "../../state/reducers/app-reducer";
import { RootStateType } from "../../state/store";
import { logoutTC } from "../../state/reducers/auth-reducer";

export const Header = () => {
  const status = useSelector<RootStateType, RequestStatusType>((state) => state.app.status);
  const isLoggedIn = useSelector<RootStateType, boolean>((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logoutTC());
  };

  return (
    <>
      <AppBar position='static'>
        <Toolbar className={"header"}>
          <IconButton edge='start' color='inherit' aria-label='menu'>
            <MenuIcon />
          </IconButton>
          {isLoggedIn && (
            <Button color='inherit' onClick={logoutHandler}>
              LogOut
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div>{status === "loading" && <LinearProgress />}</div>
    </>
  );
};
