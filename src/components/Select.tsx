import { useClickOutside } from "@/hooks/useClickOutside";
import { useState } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
};

export const Select = (props: SelectProps) => {
  const [open, setOpen] = useState(false);

  const selectVisibility = open ? "rounded-t-lg" : "rounded-lg";
  const dropDownVisibility = open ? "block" : "hidden";

  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <div
        aria-hidden="true"
        onClick={() => setOpen((prev) => !prev)}
        className={
          selectVisibility +
          " flex w-full justify-between border-2 border-slate-300 bg-gradient-to-b from-slate-200 to-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:from-slate-700 dark:to-slate-600"
        }
      >
        <div>
          <span>
            {props.options.find((o) => o.value === props.value)?.label ||
              "Select a sorting method"}
          </span>
        </div>
        <div className="clip-select-arrow h-5 w-5 bg-slate-800 dark:bg-white"></div>
      </div>

      <div
        aria-hidden="true"
        className={
          dropDownVisibility +
          " absolute z-10 w-full rounded-b-lg border-2 border-slate-300 bg-gradient-to-r from-slate-200 to-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:from-slate-700 dark:to-slate-600"
        }
      >
        {props.options.map((option) => {
          return (
            <div
              className="px-4 py-4 hover:bg-slate-100 dark:hover:bg-slate-600 md:py-2"
              key={option.value}
              onClick={(event) => {
                event.stopPropagation();
                props.onChange({
                  target: {
                    value: option.value,
                  },
                } as React.ChangeEvent<HTMLSelectElement>);
                setOpen(false);
              }}
            >
              {option.label}
            </div>
          );
        })}
      </div>
      <select
        value={props.value}
        onChange={props.onChange}
        className="visually-hide"
      >
        {props.options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};
