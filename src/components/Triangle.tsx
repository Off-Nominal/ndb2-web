import { MouseEventHandler } from "react";

type TriangleProps = {
  onClick?: MouseEventHandler<SVGSVGElement>;
  canvasClassName?: string;
  polyClassName?: string;
};

export const Triangle = (props: TriangleProps) => {
  const canvasClassName = props.canvasClassName || "";
  const polyClassName = props.polyClassName || "";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      className={["h-10 w-10 overflow-visible", canvasClassName].join(" ")}
      onClick={props.onClick}
    >
      <polygon
        points="5,0 0,10 10,10"
        fill={"white"}
        stroke={"black"}
        strokeWidth="0.25"
        className={polyClassName}
      />
    </svg>
  );
};
