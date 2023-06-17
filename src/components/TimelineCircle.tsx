type TimelineCircleProps = {
  width: number;
  stemLength?: number;
  circleClasses?: string;
  stemClasses?: string;
};

export const TimelineCircle = (props: TimelineCircleProps) => {
  const stemClasses = props.stemClasses || "";
  const circleClasses = props.circleClasses || "";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-50 -50 100 100"
      width={props.width}
      height={props.width}
      className="overflow-visible"
    >
      {props.stemLength && (
        <line
          x1={0}
          y1={(props.stemLength / props.width) * 100 + 50}
          x2={0}
          y2={62}
          strokeWidth={12}
          className={stemClasses}
        />
      )}
      <circle r={44} strokeWidth={12} className={circleClasses} />
    </svg>
  );
};
