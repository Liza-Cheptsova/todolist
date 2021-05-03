import React from "react";
import { action } from "@storybook/addon-actions";
import { Task } from "./../components/todolists/tasks/Tasks";
import { ReduxStoreProviderDecorator } from "./decorators/ReduxStoreProviderDecorator";

export default {
  title: "Task Stories",
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
};

export const TaskExample = (props: any) => {
  return <Task task={{ id: "1", isDone: false, title: "CSS" }} todolistId={"todolistId1"} />;
};
