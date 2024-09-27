import {
  buildTimeline,
  DateDrivenTimelineProps,
  EventDrivenTimelineProps,
} from "@/utils/helpers";
import { TimelineItem } from "./TimelineItem";

type TimelineProps = {
  prediction: DateDrivenTimelineProps | EventDrivenTimelineProps;
};

export const Timeline = (props: TimelineProps) => {
  const timelineItemArray = buildTimeline(props.prediction);

  const builtTimeline = timelineItemArray.map((item, i) => {
    return (
      <TimelineItem
        status={item.status}
        label={item.label}
        value={item.value}
        key={i}
        addStem={i !== timelineItemArray.length - 1}
      />
    );
  });
  return (
    <div className="grid grow basis-1/2 grid-cols-[2rem,auto,130px] grid-rows-4 gap-4">
      {builtTimeline}
    </div>
  );
};
