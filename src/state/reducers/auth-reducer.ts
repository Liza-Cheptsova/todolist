import { Dispatch } from "redux";
import { LoginParamsType } from "../../api/todolist-api";
import { SetAppStatus } from "./app-reducer";
import { authAPI } from "./../../api/todolist-api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
};

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.value };
    case "login/SET-INITIALIZED":
      return { ...state, isInitialized: action.value };
    default:
      return state;
  }
};
// actions
export const setIsLoggedInAC = (value: boolean) => ({ type: "login/SET-IS-LOGGED-IN", value } as const);
export const setisInitializedAC = (value: boolean) => ({ type: "login/SET-INITIALIZED", value } as const);

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(SetAppStatus("loading"));
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
        dispatch(SetAppStatus("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setisInitializedAC(true));
        dispatch(setIsLoggedInAC(true));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(SetAppStatus("loading"));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(SetAppStatus("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | ReturnType<typeof setisInitializedAC>;
type InitialStateType = typeof initialState;
