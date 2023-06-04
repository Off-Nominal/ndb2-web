export const TimelineCircle = (props: any) => {
  const radius = 12;
  const length = 50;
  // const dateItem = { label: "created", date: "May 22nd, 2023", status: "complete" }
  let y = -30;
  const filled = props.dateObject.status === "not_started" ? "gray" : props.dateObject.status === "complete" ? "green" : "none";
  console.log(filled)
  const stroke = props.dateObject.status === "not_started" ? "gray" : props.dateObject.status === "complete" ? "green" : "black";
    y += length;
    return (
      <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 100 75"
      className="relative w-14 "
    >
          {props.dateObject.top && <line
            x1="50"
            y1="-10"
            x2="50"
            y2={y - radius}
            stroke="gray"
            strokeWidth="2"
          />}
        
        <circle
          cx="50"
          cy={y}
          r={radius}
          fill={filled}
          stroke={stroke}
          strokeWidth="2"
        />
        {props.dateObject.bottom && 
          <line
            x1="50"
            y1={y + radius}
            x2="50"
            y2="200"
            stroke="gray"
            strokeWidth="2"
          />
        }
      </svg>
    );
};
