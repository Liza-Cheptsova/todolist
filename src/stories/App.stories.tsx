import React from "react";
import { action } from "@storybook/addon-actions";
import { Task } from "./../components/todolists/tasks/Tasks";
import { App } from "../App";
import { ReduxStoreProviderDecorator } from "./decorators/ReduxStoreProviderDecorator";

export default {
  title: "App Stories",
  component: App,
  decorators: [ReduxStoreProviderDecorator],
};

export const AppExample = (props: any) => {
  return <App />;
};
