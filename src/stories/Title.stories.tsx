import React from "react";
import { action } from "@storybook/addon-actions";
import { Title } from "./../components/formItems/Title";

export default {
  title: "Title Stories",
  component: Title,
};

export const TitleExample = (props: any) => {
  return <Title addTask={action("add title")} />;
};
