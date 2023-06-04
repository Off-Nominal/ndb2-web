import { TimelineCircle } from "./TimelineCircle";

export const TimelineItem = (props: any) => {
  return (
    <>
    <TimelineCircle dateObject={props.dateObject}/>
    <p>{props.dateObject.label}</p>
    <p>{props.dateObject.date}</p>
    </>
  )
  

};
