type PillDisplayProps = {
  text: string;
  color?: string;
  textSize?: string;
  padding?: string;
  className?: string;
};

export const PillDisplay = (props: PillDisplayProps) => {
  const colorClasses = props.color ? props.color : "bg-moonstone-blue";
  const textClasses = props.textSize ? props.textSize : "text-md";

  const className = props.className || "";

  return (
    <div
      className={[
        "flex w-full items-center justify-center rounded-full shadow-md",
        colorClasses,
        className,
      ].join(" ")}
    >
      <span
        className={[
          textClasses,
          " text-center font-bold uppercase tracking-widest ",
        ].join(" ")}
      >
        {props.text}
      </span>
    </div>
  );
};
