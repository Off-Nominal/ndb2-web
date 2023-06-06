type TriangleProps = {
  fillColor?: string,
  strokeColor?: string,
  hoverColor?: string,
  onClick: () => void,
  className?: string,
  
}

export const Triangle = (props:TriangleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      className={`w-10 h-10 ${props.className}`}
    >
      <polygon
        points="5,0 0,10 10,10"
        fill={props.fillColor? props.fillColor : "white"}
        stroke={props.strokeColor? props.strokeColor : "black"}
        strokeWidth="0.25"
        className={`hover:fill-${props.hoverColor? props.hoverColor : "moss-green"}`}
        onClick={()=> props.onClick()}
      />
    </svg>
  );
};