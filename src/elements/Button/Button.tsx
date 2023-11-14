import Link from "next/link";
import React from "react";

export type LinkButtonProps = {
  href: object | string;
  className?: string;
  disabled?: boolean;
  scroll?: boolean;
  children: any;
};

export type OnPressButtonProps = {
  onPress: any;
  className?: string;
  children: any;
  textClassName?: string;
};

export type ButtonProps<
  E extends React.ElementType = (
    props: OnPressButtonProps
  ) => React.ReactElement
> = {
  as?: E;
  textClassName?: string;
} & React.ComponentProps<E>;

export const LinkButton = ({
  className,
  href,
  scroll,
  ...props
}: LinkButtonProps) => {
  return (
    <Link className={className} href={href} scroll={scroll}>
      <a className={`block ${className}`} {...props} />
    </Link>
  );
};

function Button<E extends React.ElementType>(props: ButtonProps<E>, ref: any) {
  const {
    as: Cmp = "button",
    onPress,
    className,
    textClassName,
    ...rest
  } = props;

  return (
    <Cmp
      {...rest}
      className={`${className} ${textClassName}`}
      onClick={onPress}
      ref={ref}
    />
  );
}

const ForwardButtonRef = React.forwardRef(Button);
export default ForwardButtonRef;
