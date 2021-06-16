const initialState = {
  status: "loading" as RequestStatusType,
  error: null as null | string,
};

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    default:
      return state;
  }
};

//actions
export const SetAppStatus = (status: RequestStatusType) => {
  return { type: "APP/SET-STATUS", status } as const;
};

export const SetAppError = (error: string | null) => {
  return { type: "APP/SET-ERROR", error } as const;
};

//types
type ActionsType = ReturnType<typeof SetAppStatus> | ReturnType<typeof SetAppError>;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = typeof initialState;
