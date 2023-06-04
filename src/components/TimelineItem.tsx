import { TimelineCircle } from "./TimelineCircle";

type TimelineItemProps = {
  dateObject: {
  label: string;
  value: string;
  status:
    | "complete"
    | "complete_negative"
    | "in_progress"
    | "not_started"
    | "cancelled";
  }
  index: number
};

export const TimelineItem = (props: TimelineItemProps) => {
  
  return (
    <>
    <TimelineCircle dateObject={props.dateObject} top={props.index > 0 ? true: false} bottom={props.index <= 2 ? true : false} />
    <p>{props.dateObject.label}</p>
    <p>{props.dateObject.value !== "" ? props.dateObject.value : "-"}</p>
    </>
  )
  
};
