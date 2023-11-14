export type StringChild = string | undefined | null;

export type TextProps = {
  className?: string;
  children: StringChild | StringChild[];
  suppressHydrationWarning?: true;
};

export default function BaseText({ className, ...props }: TextProps) {
  let text: string;
  if (typeof props.children === "string") {
    text = props.children;
  } else {
    text = (props.children ?? []).filter(Boolean).join("");
  }
  return (
    <span className={`text ${className}`} {...props}>
      {text}
    </span>
  );
}
