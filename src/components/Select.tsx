import { ReactNode } from "react";
import { BaseSelect, BaseSelectProps } from "./BaseSelect";

export interface SelectProps<T extends ReactNode>
  extends Omit<BaseSelectProps<T>, "input"> {}

export const Select = <T extends ReactNode>(props: SelectProps<T>) => {
  const input = (
    <>
      <div>
        <span>
          {props.options.find((o) => o.value === props.value)?.label ||
            "Select a sorting method"}
        </span>
      </div>
      <div className="clip-select-arrow h-5 w-5 bg-slate-800 dark:bg-white"></div>
    </>
  );

  return (
    <BaseSelect
      options={props.options}
      value={props.value}
      onChange={props.onChange}
      className={props.className}
      input={input}
    />
  );
};
