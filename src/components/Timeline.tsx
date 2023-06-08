import { buildTimeline } from "@/utils/helpers";
import { TimelineItem } from "./TimelineItem";
import { PredictionLifeCycle } from "@/types/predictions";

type TimelineProps = {
  status: PredictionLifeCycle;
  created_date: Date;
  due_date: Date;
  closed_date: Date | null;
  triggered_date: Date | null;
  retired_date: Date | null;
  judged_date: Date | null;
};

export const Timeline = (props: TimelineProps) => {
  const timelineItemArray = buildTimeline(
    props.status,
    props.created_date,
    props.due_date,
    props.closed_date,
    props.triggered_date,
    props.retired_date,
    props.judged_date
  );

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
