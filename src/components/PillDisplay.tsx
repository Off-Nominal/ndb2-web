type PillDisplayProps = {
  text: string;
  color?: string;
  textSize?: string;
  padding?: string;
};

export const PillDisplay = (props: PillDisplayProps) => {
  const colorClasses = props.color ? props.color : "bg-moonstone-blue";
  const textClasses = props.textSize ? props.textSize : "text-md";
  const paddingClasses = props.padding ? props.padding : "px-6 py-3";

  
  return (
    
      <span
        className={[
          colorClasses,
          textClasses,
          paddingClasses,
          "inline rounded-full text-center font-bold uppercase tracking-widest shadow-md w-full",
        ].join(" ")}
      >
        {props.text}
      </span>
  );
};
