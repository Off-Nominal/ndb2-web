import { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const Button = (props: ButtonProps) => {
  return (
    <button
      className="rounded-full bg-moss-green px-8 py-4 text-center text-2xl font-bold uppercase tracking-widest shadow-md hover:bg-moss-green-dark"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};
