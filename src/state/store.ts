import { applyMiddleware, combineReducers, createStore } from "redux";
import { todolistReducer } from "./reducers/todolist-reducer";
import { tasksReducer } from "./reducers/tasks-reducer";
import thunk from "redux-thunk";
import { appReducer } from "./reducers/app-reducer";
import { authReducer } from "./reducers/auth-reducer";

export type RootStateType = ReturnType<typeof rootReducers>;

const rootReducers = combineReducers({
  todolists: todolistReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = createStore(rootReducers, applyMiddleware(thunk));
