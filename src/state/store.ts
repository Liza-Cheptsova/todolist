import { applyMiddleware, combineReducers, createStore } from "redux";
import { todolistReducer } from "./reducers/todolist-reducer";
import { tasksReducer } from "./reducers/tasks-reducer";
import thunk from "redux-thunk";

export type RootStateType = ReturnType<typeof rootReducers>;

const rootReducers = combineReducers({
  todolists: todolistReducer,
  tasks: tasksReducer,
});

export const store = createStore(rootReducers, applyMiddleware(thunk));
