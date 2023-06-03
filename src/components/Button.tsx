import { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode | ReactNode[];
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const Button = (props: ButtonProps) => {
  let sizeClasses = "px-6 py-3 text-lg";

  if (props.size === "sm") {
    sizeClasses = "px-6 py-2 text-md";
  } else if (props.size === "md") {
    sizeClasses = "px-6 py-3 text-lg";
  } else if (props.size === "lg") {
    sizeClasses = "px-8 py-4 text-2xl";
  }

  const type: "button" | "submit" | "reset" | undefined =
    props.type || "button";

  return (
    <button
      type={type}
      className={
        sizeClasses +
        " rounded-full bg-moss-green text-center font-bold uppercase tracking-widest shadow-md hover:bg-moss-green-dark"
      }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
