type TimelineCircleProps = {
  dateObject: {
    label: string;
    value: string;
    status: string;
  };
  top: boolean;
  bottom: boolean;
};

export const TimelineCircle = (props: TimelineCircleProps) => {
  const radius = 12;
  const length = 25;
  let y = length - (length + length / 2);
  const filled =
    props.dateObject.status === "not_started"
      ? "gray"
      : props.dateObject.status === "complete"
      ? "green"
      : "none";
  const stroke =
    props.dateObject.status === "not_started"
      ? "gray"
      : props.dateObject.status === "complete"
      ? "green"
      : "black";
  y += length;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 100 75"
      className="relative w-14 "
    >
      {props.top && (
        <line
          x1="50"
          y1="-10"
          x2="50"
          y2={y - radius}
          stroke="gray"
          strokeWidth="2"
        />
      )}

      <circle
        cx="50"
        cy={y}
        r={radius}
        fill={filled}
        stroke={stroke}
        strokeWidth="2"
      />
      {props.bottom && (
        <line
          x1="50"
          y1={y + radius}
          x2="50"
          y2="200"
          stroke="gray"
          strokeWidth="2"
        />
      )}
    </svg>
  );
};
