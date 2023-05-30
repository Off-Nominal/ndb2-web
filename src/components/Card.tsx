import { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode | ReactNode[];
  className?: string;
};

export const Card = (props: CardProps) => {
  return (
    <div
      className={
        "rounded-3xl bg-platinum-grey shadow-md dark:bg-quartz-grey " +
        props.className
      }
    >
      <div className={"rounded-t-3xl bg-moonstone-blue px-8 py-2"}>
        <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
          {props.title}
        </h2>
      </div>
      <div>{props.children}</div>
    </div>
  );
};
