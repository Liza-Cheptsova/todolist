import React, { useCallback, useEffect } from "react";
import { Title } from "../formItems/Title";
import { EditableSpan } from "../ editableSpan/EditableSpan";
import { Button, IconButton } from "@material-ui/core";
import { DeleteForever } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "../../state/store";
import { addTaskThunk, fetchTasksTC } from "../../state/reducers/tasks-reducer";
import { Task } from "./tasks/Tasks";
import { FilterValuesType, TodolistDomainType } from "../../state/reducers/todolist-reducer";
import { TaskType } from "../../api/tasks-api";

type PropsType = {
  todolist: TodolistDomainType;
  removeTodolist: (id: string) => void;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  newTodolistTitle: (newTitle: string, id: string) => void;
};

export const Todolist: React.FC<PropsType> = (props) => {
  const tasks = useSelector<RootStateType, Array<TaskType>>((state) => state.tasks[props.todolist.id]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasksTC(props.todolist.id));
  }, [dispatch, props.todolist.id]);

  const removeTodolistHandler = useCallback(() => {
    props.removeTodolist(props.todolist.id);
    // }, [props.id, props.removeTodolist, props]);
  }, [props]);

  const addTaskItem = useCallback(
    (title: string) => {
      dispatch(addTaskThunk(props.todolist.id, title));
    },
    // [dispatch, props.id, props]
    [dispatch, props]
  );

  const addNewTitle = useCallback(
    (newTitle: string) => {
      props.newTodolistTitle(props.todolist.id, newTitle);
    },
    // [props.id, props.newTodolistTitle, props]
    [props]
  );

  const onAllClickHandler = useCallback(() => props.changeFilter("all", props.todolist.id), [
    // props.changeFilter,
    // props.id,
    // props,
    props,
  ]);
  const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.todolist.id), [
    // props.changeFilter,
    // props.id,
    props,
  ]);
  const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.todolist.id), [
    // props.changeFilter,
    // props.id,
    props,
  ]);

  let allTaskForTodolist = tasks;
  let tasksForTodolist = allTaskForTodolist;

  if (props.todolist.filter === "active") {
    tasksForTodolist = allTaskForTodolist.filter((t) => !t.status);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = allTaskForTodolist.filter((t) => t.status);
  }

  return (
    <div>
      <h3>
        <EditableSpan
          value={props.todolist.title}
          newTitle={addNewTitle}
          disabled={props.todolist.entityStatus === "loading"}
        />
        <IconButton
          aria-label='delete'
          onClick={removeTodolistHandler}
          disabled={props.todolist.entityStatus === "loading"}
        >
          <DeleteForever />
        </IconButton>
      </h3>
      <Title addTask={addTaskItem} disabled={props.todolist.entityStatus === "loading"} />
      <ul className={"tasks_container"}>
        {tasksForTodolist.map((t) => {
          return <Task task={t} todolistId={props.todolist.id} key={t.id} disabled={t.entityStatus === "loading"} />;
        })}
      </ul>
      <div className={"btns_container"}>
        <Button
          color='inherit'
          onClick={onAllClickHandler}
          variant={props.todolist.filter === "all" ? "outlined" : "text"}
        >
          All
        </Button>
        <Button
          color='primary'
          onClick={onActiveClickHandler}
          variant={props.todolist.filter === "active" ? "outlined" : "text"}
        >
          Active
        </Button>
        <Button
          color='secondary'
          onClick={onCompletedClickHandler}
          variant={props.todolist.filter === "completed" ? "outlined" : "text"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};
