import React, { useCallback, useEffect } from "react";
import { Title } from "../formItems/Title";
import { EditableSpan } from "../ editableSpan/EditableSpan";
import { Button, IconButton } from "@material-ui/core";
import { DeleteForever } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "../../state/store";
import { addTaskThunk, fetchTasksTC } from "../../state/reducers/tasks-reducer";
import { Task } from "./tasks/Tasks";
import { FilterValuesType } from "../../state/reducers/todolist-reducer";
import { TaskType } from "../../api/tasks-api";

type PropsType = {
  id: string;
  title: string;
  removeTodolist: (id: string) => void;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  newTodolistTitle: (newTitle: string, id: string) => void;
  filter: FilterValuesType;
};

export const Todolist: React.FC<PropsType> = (props) => {
  console.log("Todolist is change");
  const tasks = useSelector<RootStateType, Array<TaskType>>((state) => state.tasks[props.id]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasksTC(props.id));
  }, []);

  const removeTodolistHandler = useCallback(() => {
    props.removeTodolist(props.id);
  }, [props.id, props.removeTodolist]);

  const addTaskItem = useCallback(
    (title: string) => {
      dispatch(addTaskThunk(props.id, title));
    },
    [dispatch, props.id]
  );

  const addNewTitle = useCallback(
    (newTitle: string) => {
      props.newTodolistTitle(props.id, newTitle);
    },
    [props.id, props.newTodolistTitle]
  );

  const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.changeFilter, props.id]);
  const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [
    props.changeFilter,
    props.id,
  ]);
  const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [
    props.changeFilter,
    props.id,
  ]);

  let allTaskForTodolist = tasks;
  let tasksForTodolist = allTaskForTodolist;

  if (props.filter === "active") {
    tasksForTodolist = allTaskForTodolist.filter((t) => !t.status);
  }
  if (props.filter === "completed") {
    tasksForTodolist = allTaskForTodolist.filter((t) => t.status);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} newTitle={addNewTitle} />
        <IconButton aria-label='delete' onClick={removeTodolistHandler}>
          <DeleteForever />
        </IconButton>
      </h3>
      <Title addTask={addTaskItem} />
      <ul className={"tasks_container"}>
        {tasksForTodolist.map((t) => {
          return <Task task={t} todolistId={props.id} key={t.id} />;
        })}
      </ul>
      <div className={"btns_container"}>
        <Button color='inherit' onClick={onAllClickHandler} variant={props.filter === "all" ? "outlined" : "text"}>
          All
        </Button>
        <Button
          color='primary'
          onClick={onActiveClickHandler}
          variant={props.filter === "active" ? "outlined" : "text"}
        >
          Active
        </Button>
        <Button
          color='secondary'
          onClick={onCompletedClickHandler}
          variant={props.filter === "completed" ? "outlined" : "text"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};
