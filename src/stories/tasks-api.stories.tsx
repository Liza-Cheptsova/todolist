import React, { useEffect, useState } from "react";
import { taskAPI } from "./../api/tasks-api";

export default {
  title: "TASKS-API",
};

export const GetTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "4745a333-035f-4ad3-9fd9-958b36556fe8";
    taskAPI.getTasks(todolistId).then((res) => {
      setState(res.data.items);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "4745a333-035f-4ad3-9fd9-958b36556fe8";
    taskAPI.addTask(todolistId, "FIRST TASK").then((res) => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "4745a333-035f-4ad3-9fd9-958b36556fe8";
    const taskId = "633ad794-4c0d-4254-af03-acc5247374af";
    taskAPI.updateTask(todolistId, taskId, "NEW TASK TITLE").then((res) => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "4745a333-035f-4ad3-9fd9-958b36556fe8";
    const taskId = "633ad794-4c0d-4254-af03-acc5247374af";
    taskAPI.deleteTask(todolistId, taskId).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
