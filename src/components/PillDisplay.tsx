type PillDisplayProps = {
  text: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg";
};

export const PillDisplay = (props: PillDisplayProps) => {
  let sizeClasses = "px-6 py-3 text-lg";
  const colorClasses = props.color ? props.color : "bg-moonstone-blue";

  if (props.size === "xs") {
    sizeClasses = "px-4 py-0 text-sm";
  } else if (props.size === "sm") {
    sizeClasses = "px-6 py-2 text-md";
  } else if (props.size === "md") {
    sizeClasses = "px-6 py-3 text-lg";
  } else if (props.size === "lg") {
    sizeClasses = "px-8 py-4 text-2xl";
  }

  return (
    <span
      className={[
        colorClasses,
        sizeClasses,
        "inline rounded-full text-center font-bold uppercase tracking-widest shadow-md",
      ].join(" ")}
    >
      {props.text}
    </span>
  );
};
