import React from "react";

export default function Box<E extends React.ElementType = "div">(
  props: {
    as?: E;
  } & React.ComponentProps<E>
) {
  const { as: Cmp = "div", ...rest } = props;

  return <Cmp {...rest} />;
}
