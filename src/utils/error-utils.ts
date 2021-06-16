import { Dispatch } from "redux";
import { ResponceType } from "../api/todolist-api";
import { SetAppError, SetAppStatus } from "../state/reducers/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponceType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(SetAppError(data.messages[0]));
  } else {
    dispatch(SetAppError("Some error occurred"));
  }
  dispatch(SetAppStatus("failed"));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(SetAppError(error.message));
  dispatch(SetAppStatus("failed"));
};

// type ErrorUtilsDispatchType = Dispatch<SetAppErrorActionType | SetAppStatusActionType>
