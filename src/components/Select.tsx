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

const classes = "bg-slate-200  p-4 font-bold uppercase ";
export const Select = (props: SelectProps) => {
  return (
    <div className="after:clip-select-arrow relative grid w-full cursor-pointer items-center rounded-lg border-2 border-slate-300 bg-gradient-to-b from-slate-200 to-slate-300 py-1 [grid-template-areas:select] after:h-3 after:w-5 after:justify-self-end after:bg-slate-500 after:[grid-area:'select'] dark:border-slate-600 dark:bg-slate-700 dark:from-slate-700 dark:to-slate-600 dark:after:bg-slate-200">
      <select
        value={props.value}
        onChange={props.onChange}
        className="z-10 w-full appearance-none border-none bg-transparent p-0 pr-4 outline-none [grid-area:select]"
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
