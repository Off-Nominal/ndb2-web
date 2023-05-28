export const PillDisplay = (props: {text: string}) => {
  return (
    <div className="relative flex flex-wrap content-center justify-center w-20 h-8 rounded-full bg-moonstone-blue">
      <p>{props.text}</p>
    </div>
  );
};
