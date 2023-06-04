import { ReactNode, useState } from "react";
import { BaseSelect, BaseSelectProps } from "./BaseSelect";
import { useClickOutside } from "@/hooks/useClickOutside";

export interface AutocompleteProps<T extends ReactNode>
  extends Omit<BaseSelectProps<T>, "input" | "onChange"> {
  onChange: (value: string) => void;
  onSearch: (searchTerm: string) => void;
}

const findOptionByValue = <T extends ReactNode>(
  options: BaseSelectProps<T>["options"],
  value: string
) => {
  return options.find((o) => o.value === value);
};

export const Autocomplete = <T extends ReactNode>(
  props: AutocompleteProps<T>
) => {
  const [typing, setTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useClickOutside(() => setTyping(false));

  const changeHandler = (value: string) => {
    setTyping(false);
    setSearchTerm("");
    props.onChange(value);
  };

  const input = (
    <div
      ref={ref}
      className="w-full"
      onClick={() => {
        props.onSearch("");
        setTyping(true);
      }}
    >
      {!typing &&
        (props.value ? (
          <div className="flex items-start justify-between gap-1">
            {findOptionByValue(props.options, props.value)?.label}
            <div className="grow-0 basis-6">
              <div
                aria-label="Clear selection"
                className="after:clip-x relative left-2  h-[24px] w-[24px] scale-75 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:scale-75 after:bg-slate-400 hover:bg-slate-300 after:hover:bg-slate-500"
                onClick={(event) => {
                  event.stopPropagation();
                  changeHandler("");
                }}
              ></div>
            </div>
          </div>
        ) : (
          <span className="text-slate-400">Select a member</span>
        ))}
      {typing && (
        <input
          autoFocus
          onChange={(event) => {
            setSearchTerm(event.target.value);
            props.onSearch(event.target.value);
          }}
          className="w-full bg-transparent focus-visible:outline-none"
          value={searchTerm}
        />
      )}
    </div>
  );

  return (
    <BaseSelect
      name={props.name}
      options={props.options}
      value={props.value}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
        changeHandler(event.target.value)
      }
      className={props.className}
      input={input}
      optionLimit={10}
    />
  );
};
