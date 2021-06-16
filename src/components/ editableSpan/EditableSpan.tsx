import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { TextField } from "@material-ui/core";

type PropsType = {
  value: string;
  newTitle: (newTitle: string) => void;
  disabled?: boolean;
};

export const EditableSpan = React.memo((props: PropsType) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(props.value);

  const onDblClickHandler = () => {
    setEditMode(!editMode);
    setTitle(props.value);
    if (props.disabled) {
      setEditMode(false);
    }
  };

  console.log("props.disabled: ", props.disabled);

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const activeViewMode = () => {
    setEditMode(!editMode);
    if (title.trim() !== "") {
      props.newTitle(title);
    }
  };

  const addTaskOnKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13) {
      activeViewMode();
    }
  };

  return editMode ? (
    <TextField
      type='text'
      value={title}
      onChange={changeTitle}
      autoFocus
      onBlur={activeViewMode}
      onKeyPress={addTaskOnKeyPressHandler}
    />
  ) : (
    <span onDoubleClick={onDblClickHandler}>{props.value}</span>
  );
});
