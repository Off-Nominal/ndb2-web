import { MouseEventHandler } from "react";

type TriangleProps = {
  endorse: boolean;
  onClick: MouseEventHandler<SVGSVGElement>;
  className?: string;
};

export const Triangle = (props: TriangleProps) => {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      className={`relative h-8 w-8 ${props.className}`}
      onClick={(e) => props.onClick(e)}
    >
      <polygon
        points="20,0 40,40 0,40"
        fill={"white"}
        stroke={"black"}
        strokeWidth="1"
        className={
          props.endorse
            ? "hover:fill-moss-green"
            : "hover:fill-deep-chestnut-red"
        }
        
      />
    </svg>
  );
};
