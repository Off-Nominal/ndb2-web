import { TimelineCircle } from "./TimelineCircle";

type TimelineItemProps = {
  status:
    | "complete"
    | "complete_negative"
    | "in_progress"
    | "not_started"
    | "cancelled";
  label: string;
  value: string;
  addStem: boolean;
};

export const TimelineItem = (props: TimelineItemProps) => {
  let circleClasses;

  switch (props.status) {
    case "complete":
      circleClasses = "fill-moss-green stroke-moss-green";
      break;
    case "complete_negative":
      circleClasses = "fill-deep-chestnut-red stroke-deep-chestnut-red";
      break;
    case "in_progress":
      circleClasses = "fill-none stroke-moss-green";
      break;
    case "not_started":
      circleClasses = "fill-none stroke-silver-chalice-grey";
      break;
    case "cancelled":
      circleClasses = "fill-none stroke-slate-400 dark:stroke-slate-500";
      break;
  }

  return (
    <>
      <TimelineCircle
        width={24}
        stemLength={props.addStem ? 13 : undefined}
        stemClasses="stroke-slate-400 dark:stroke-silver-chalice-grey"
        circleClasses={circleClasses}
      />
      <div className="font-bold uppercase">{props.label}</div>
      <div className="flex justify-end">
        {props.value !== "" ? props.value : "-"}
      </div>
    </>
  );
};
