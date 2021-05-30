import React, { ChangeEvent, useCallback } from "react";
import { deleteTaskThunk, newTaskTitleAC, removeTaskAC, updateTaskTC } from "../../../state/reducers/tasks-reducer";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "../../ editableSpan/EditableSpan";
import { DeleteForever } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { TaskStatuses, TaskType } from "../../../api/tasks-api";

type PropsType = {
  task: TaskType;
  todolistId: string;
};

export const Task = React.memo((props: PropsType) => {
  const dispatch = useDispatch();

  const removeTaskHandler = () => dispatch(deleteTaskThunk(props.todolistId, props.task.id));
  const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newStatusValue = e.currentTarget.checked;
    let status = newStatusValue ? TaskStatuses.Completed : TaskStatuses.New;
    dispatch(updateTaskTC(props.task.id, { status }, props.todolistId));
  };

  const addNewTitle = useCallback(
    (newTitle: string) => {
      dispatch(updateTaskTC(props.task.id, { title: newTitle }, props.todolistId));
    },
    [dispatch, props.todolistId, props.task.id]
  );

  return (
    <>
      <li key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
        <Checkbox
          color='primary'
          inputProps={{ "aria-label": "secondary checkbox" }}
          onChange={onChangeStatusHandler}
          checked={props.task.status === TaskStatuses.Completed}
        />
        <EditableSpan value={props.task.title} newTitle={addNewTitle} />
        <IconButton onClick={removeTaskHandler}>
          <DeleteForever />
        </IconButton>
      </li>
    </>
  );
});
