import { buildTimeline } from "@/utils/helpers";
import { TimelineItem } from "./TimelineItem";
import { PredictionLifeCycle } from "@/types/predictions";

type TimelineProps = {
  status: PredictionLifeCycle,
  created_date: Date,
  due_date: Date,
  closed_date: Date | null, 
  triggered_date: Date | null, 
  retired_date: Date | null, 
  judged_date: Date | null
}

export const Timeline = (props: TimelineProps) => {

  const {status,created_date, due_date, closed_date, triggered_date, retired_date, judged_date} = props;

  const timelineItemArray = buildTimeline(status,created_date, due_date, closed_date, triggered_date, retired_date, judged_date)
  
  const builtTimeline = timelineItemArray.map((date, index) => {
    return (
      <TimelineItem dateObject={date} key={index} index={index} />
    )
  });
  return (
    <div className="grid grid-cols-3 gap-y-0">
     
    {builtTimeline}
    </div>
  );
};
