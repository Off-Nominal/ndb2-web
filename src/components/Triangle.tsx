import { MouseEventHandler } from "react";

type TriangleProps = {
  fillColor?: string;
  strokeColor?: string;
  hoverColor?: string;
  onClick: MouseEventHandler<SVGSVGElement>;
  className?: string;
};

export const Triangle = (props: TriangleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      className={`h-10 w-10 ${props.className}`}
      onClick={props.onClick}
    >
      <polygon
        points="5,0 0,10 10,10"
        fill={props.fillColor ? props.fillColor : "white"}
        stroke={props.strokeColor ? props.strokeColor : "black"}
        strokeWidth="0.25"
        className={`hover:fill-${
          props.hoverColor ? props.hoverColor : "moss-green"
        }`}
      />
    </svg>
  );
};
