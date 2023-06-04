type CheckboxButtonListProps<T> = {
  items: {
    name: string;
    value: T;
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }[];
};

export const CheckboxButtonList = <
  T extends string | number | readonly string[] | undefined
>(
  props: CheckboxButtonListProps<T>
) => {
  return (
    <div className="w-full">
      <fieldset className={"flex w-full flex-col md:flex-row"}>
        {props.items.map((item, i) => {
          let classes = `after:-z-10 after:border after:border-slate-400 after:dark:border-slate-600 peer-checked:after:border-moonstone-blue peer-checked:after:bg-moonstone-blue font-bold after:absolute after:left-0 after:right-0 after:top-0 after:block after:h-full after:w-full after:dark:bg-slate-700 after:bg-slate-200`;

          if (props.items.length === 1) {
            classes += " after:rounded-lg";
          } else {
            if (i === 0) {
              classes +=
                " after:rounded-tl-lg after:rounded-tr-lg md:after:rounded-tr-none md:after:rounded-bl-lg";
            } else if (i === props.items.length - 1) {
              classes +=
                " after:rounded-br-lg after:rounded-bl-lg md:after:rounded-bl-none md:after:rounded-tr-lg";
            }
          }

          return (
            <div
              className={"relative flex grow px-6 py-2.5 md:justify-center"}
              key={item.name}
            >
              <input
                className={"peer absolute left-0 top-0 h-full w-full opacity-0"}
                type="checkbox"
                name={item.name}
                id={"checkbox-list-item-" + i + "-" + item.name}
                checked={item.checked}
                value={item.value}
                onChange={item.onChange}
              />
              <label
                htmlFor={"checkbox-list-item-" + i + "-" + item.name}
                className={classes}
              >
                {item.label.toUpperCase()}
              </label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
};
