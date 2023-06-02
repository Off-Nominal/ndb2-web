import { ReactNode, useState } from "react";
import { BaseSelect, BaseSelectProps } from "./BaseSelect";

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

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTyping(false);
    setSearchTerm("");
    props.onChange(event.target.value);
  };

  const input = (
    <div
      className="w-full"
      onClick={() => {
        setTyping(true);
      }}
    >
      {!typing &&
        (props.value ? (
          findOptionByValue(props.options, props.value)?.label
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
      options={props.options}
      value={props.value}
      onChange={changeHandler}
      className={props.className}
      input={input}
      optionLimit={10}
    />
  );
};
