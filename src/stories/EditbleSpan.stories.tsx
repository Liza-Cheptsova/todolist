import React from "react";
import { action } from "@storybook/addon-actions";
import { EditableSpan } from "./../components/ editableSpan/EditableSpan";

export default {
  title: "Editblespan Stories",
  component: EditableSpan,
};

export const EditableSpanExample = (props: any) => {
  return <EditableSpan value={"start value"} newTitle={action("text")} />;
};
