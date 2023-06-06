type TriangleProps = {
  fillColor?: string,
  strokeColor?: string,
  hoverColor?: string,
  onClick: () => void
}

export const Triangle = (props:TriangleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      className="relative w-40 h-20"
    >
      <polygon
        points="110,10 130,50 90,50"
        fill={props.fillColor? props.fillColor : "white"}
        stroke={props.strokeColor? props.strokeColor : "black"}
        strokeWidth="1"
        className={`hover:fill-${props.hoverColor? props.hoverColor : "moss-green"}`}
        onClick={()=> props.onClick()}
      />
    </svg>
  );
};