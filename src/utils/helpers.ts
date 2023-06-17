import { PredictionLifeCycle } from "@/types/predictions";
import { format } from "date-fns";

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + "...";
};

type TimelineItem = {
  label: string;
  value: string;
  status:
    | "complete"
    | "complete_negative"
    | "in_progress"
    | "not_started"
    | "cancelled";
};

export const buildTimeline = (
  status: PredictionLifeCycle,
  createdDate: Date,
  dueDate: Date,
  closedDate: Date | null,
  triggeredDate: Date | null,
  retiredDate: Date | null,
  judgedDate: Date | null
): [TimelineItem, TimelineItem, TimelineItem, TimelineItem] => {
  const dateFormat = "MMM do, yyyy";

  const item1: TimelineItem = {
    label: "Created",
    value: format(createdDate, dateFormat),
    status: "complete",
  };

  let item2: TimelineItem;

  if (status === PredictionLifeCycle.OPEN) {
    item2 = {
      label: "Due",
      value: format(dueDate, dateFormat),
      status: "in_progress",
    };
  } else if (status === PredictionLifeCycle.RETIRED && retiredDate) {
    item2 = {
      label: "Retired",
      value: format(retiredDate, dateFormat),
      status: "complete_negative",
    };
  } else {
    item2 = {
      label: "Triggered",
      value: triggeredDate ? format(triggeredDate, dateFormat) : "",
      status: "complete",
    };
  }

  let item3: TimelineItem;

  if (status === PredictionLifeCycle.OPEN) {
    item3 = {
      label: "Close",
      value: "",
      status: "not_started",
    };
  } else if (status === PredictionLifeCycle.RETIRED) {
    item3 = {
      label: "Due",
      value: format(dueDate, dateFormat),
      status: "cancelled",
    };
  } else {
    item3 = {
      label: "Eff. Close",
      value: closedDate ? format(closedDate, dateFormat) : "",
      status: "complete",
    };
  }

  let item4: TimelineItem;

  if (status === PredictionLifeCycle.OPEN) {
    item4 = {
      label: "Judgement",
      value: "",
      status: "not_started",
    };
  } else if (status === PredictionLifeCycle.RETIRED) {
    item4 = {
      label: "Judgement",
      value: "",
      status: "cancelled",
    };
  } else if (status === PredictionLifeCycle.FAILED) {
    item4 = {
      label: "Judgement",
      value: judgedDate ? format(judgedDate, dateFormat) : "",
      status: "complete_negative",
    };
  } else {
    item4 = {
      label: "Judged",
      value: judgedDate ? format(judgedDate, dateFormat) : "",
      status: "complete",
    };
  }

  return [item1, item2, item3, item4];
};
