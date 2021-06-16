import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "../../state/store";
import { SetAppError } from "../../state/reducers/app-reducer";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

export function ErrorSnackbar() {
  const error = useSelector<RootStateType, string | null>((state) => state.app.error);
  const dispatch = useDispatch();

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    // if (reason === "clickaway") {
    //   return;
    // }
    dispatch(SetAppError(null));
  };

  return (
    <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity='error'>
        {error}
      </Alert>
    </Snackbar>
  );
}
