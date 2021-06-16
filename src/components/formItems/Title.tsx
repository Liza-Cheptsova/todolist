import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { AddBox } from "@material-ui/icons";

type PropsType = {
  addTask: (title: string) => void;
  disabled?: boolean;
};

export const Title = React.memo((props: PropsType) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const newTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTaskTitle(e.currentTarget.value);
  };

  const addTaskHandler = () => {
    if (taskTitle.trim() !== "") {
      props.addTask(taskTitle);
      setTaskTitle("");
    } else {
      setError("Title is required");
    }
  };

  const addTaskOnKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) setError(null);
    if (e.charCode === 13) {
      addTaskHandler();
    }
  };

  return (
    <div>
      <TextField
        value={taskTitle}
        disabled={props.disabled}
        label='Введите текст'
        helperText={error}
        error={!!error}
        onChange={newTaskTitleHandler}
        onKeyPress={addTaskOnKeyPressHandler}
        color={"primary"}
        variant='outlined'
      />
      <IconButton color={"primary"} onClick={addTaskHandler} disabled={props.disabled}>
        <AddBox />
      </IconButton>
    </div>
  );
});
