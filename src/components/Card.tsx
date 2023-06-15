import { ReactNode } from "react";

type CardProps = {
  header: ReactNode;
  children: ReactNode | ReactNode[];
  className?: string;
};

export const Card = (props: CardProps) => {
  return (
    <div
      className={
        "rounded-3xl bg-gradient-to-r from-slate-200 to-slate-300 shadow-md dark:from-slate-700 dark:to-slate-600 " +
        props.className
      }
    >
      <div className={"rounded-t-3xl bg-moonstone-blue px-8 py-2"}>
        {props.header}
      </div>
      <div>{props.children}</div>
    </div>
  );
};
