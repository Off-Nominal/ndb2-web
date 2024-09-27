import {
  APIPredictions,
  PredictionDriver,
  PredictionLifeCycle,
} from "@/types/predictions";
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

interface BuildTimeLinePropsBase {
  status: PredictionLifeCycle;
  created_date: string;
  retired_date: string | null;
  triggered_date: string | null;
  judged_date: string | null;
  closed_date: string | null;
}

export interface EventDrivenTimelineProps extends BuildTimeLinePropsBase {
  driver: PredictionDriver.EVENT;
  check_date: string;
}

export interface DateDrivenTimelineProps extends BuildTimeLinePropsBase {
  driver: PredictionDriver.DATE;
  due_date: string;
}

export const buildTimeline = (
  prediction: DateDrivenTimelineProps | EventDrivenTimelineProps
): [TimelineItem, TimelineItem, TimelineItem, TimelineItem] => {
  const dateFormat = "MMM do, yyyy";

  const createdDate = new Date(prediction.created_date);

  const item1: TimelineItem = {
    label: "Created",
    value: format(createdDate, dateFormat),
    status: "complete",
  };

  let item2: TimelineItem = {
    label: "",
    value: "",
    status: "not_started",
  };

  if (
    prediction.status === PredictionLifeCycle.OPEN ||
    prediction.status === PredictionLifeCycle.CHECKING
  ) {
    if (prediction.driver === PredictionDriver.EVENT) {
      const checkDate = new Date(prediction.check_date);
      item2 = {
        label: "Will Check",
        value: format(checkDate, dateFormat),
        status: "in_progress",
      };
    } else if (prediction.driver === PredictionDriver.DATE) {
      const dueDate = new Date(prediction.due_date);
      item2 = {
        label: "Due",
        value: format(dueDate, dateFormat),
        status: "in_progress",
      };
    }
  } else if (
    prediction.status === PredictionLifeCycle.RETIRED &&
    prediction.retired_date
  ) {
    const retiredDate = new Date(prediction.retired_date);
    item2 = {
      label: "Retired",
      value: format(retiredDate, dateFormat),
      status: "complete_negative",
    };
  } else if (prediction.triggered_date) {
    const triggeredDate = new Date(prediction.triggered_date);
    item2 = {
      label: "Triggered",
      value: triggeredDate ? format(triggeredDate, dateFormat) : "",
      status: "complete",
    };
  }

  let item3: TimelineItem = {
    label: "",
    value: "",
    status: "not_started",
  };

  if (
    prediction.status === PredictionLifeCycle.OPEN ||
    prediction.status === PredictionLifeCycle.CHECKING
  ) {
    item3 = {
      label: "Close",
      value: "",
      status: "not_started",
    };
  } else if (prediction.status === PredictionLifeCycle.RETIRED) {
    if (prediction.driver === PredictionDriver.EVENT) {
      const checkDate = new Date(prediction.check_date);
      item3 = {
        label: "Check",
        value: format(checkDate, dateFormat),
        status: "cancelled",
      };
    } else {
      const dueDate = new Date(prediction.due_date);
      item3 = {
        label: "Due",
        value: format(dueDate, dateFormat),
        status: "cancelled",
      };
    }
  } else if (prediction.closed_date) {
    const closedDate = new Date(prediction.closed_date);
    item3 = {
      label: "Eff. Close",
      value: closedDate ? format(closedDate, dateFormat) : "",
      status: "complete",
    };
  }

  let item4: TimelineItem = {
    label: "",
    value: "",
    status: "not_started",
  };

  if (
    prediction.status === PredictionLifeCycle.OPEN ||
    prediction.status === PredictionLifeCycle.CHECKING
  ) {
    item4 = {
      label: "Judgement",
      value: "",
      status: "not_started",
    };
  } else if (prediction.status === PredictionLifeCycle.RETIRED) {
    item4 = {
      label: "Judgement",
      value: "",
      status: "cancelled",
    };
  } else if (prediction.judged_date) {
    const judgedDate = new Date(prediction.judged_date);

    if (prediction.status === PredictionLifeCycle.FAILED) {
      item4 = {
        label: "Judgement",
        value: judgedDate ? format(judgedDate, dateFormat) : "",
        status: "complete_negative",
      };
    } else if (prediction.status === PredictionLifeCycle.SUCCESSFUL) {
      item4 = {
        label: "Judged",
        value: judgedDate ? format(judgedDate, dateFormat) : "",
        status: "complete",
      };
    }
  }

  return [item1, item2, item3, item4];
};

export const getURLSearchParams = (searchParams: {
  [key: string]: string | string[] | undefined;
}): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }
  });

  return params;
};

export const generateURIComponent = (
  path: string,
  queryString: string
): string => {
  const uriComponent = path + (queryString ? "?" + queryString : "");
  return encodeURIComponent(uriComponent);
};
