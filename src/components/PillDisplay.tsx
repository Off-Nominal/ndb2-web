export const PillDisplay = (props: {text: string, color?: string}) => {
  return (
    <div className={`relative flex flex-wrap content-center justify-center h-auto rounded-full w-32 ${props.color ? props.color : "bg-moonstone-blue"}`}>
      <p>{props.text}</p>
    </div>
  );
};
