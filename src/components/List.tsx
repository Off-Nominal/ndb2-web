import { ReactNode } from "react";

type ListProps = {
  items: ReactNode[];
};

export const List = (props: ListProps) => {
  return (
    <ul className="flex flex-col pb-4">
      {props.items.map((item, i) => {
        return (
          <li className="px-4 py-2 hover:bg-jet-grey sm:py-4" key={i}>
            {item}
          </li>
        );
      })}
    </ul>
  );
};
