import {
  APIPredictions,
  PredictionLifeCycle,
  SearchOptions,
  SortByOption,
} from "@/types/predictions";
import { responseHandler } from "@/utils/misc";
import { useEffect, useState } from "react";

const findStatus = (
  status: PredictionLifeCycle,
  statuses: PredictionLifeCycle[]
): boolean => {
  return statuses.find((s) => s === status) !== undefined;
};

const allStatuses = (statuses: PredictionLifeCycle[]): boolean => {
  return statuses.length === 5 || statuses.length === 0;
};

export const usePredictionSearch = () => {
  const [predictions, setPredictions] = useState<
    APIPredictions.EnhancedPrediction[]
  >([]);

  // Search Params States
  const [statuses, setStatuses] = useState<PredictionLifeCycle[]>([]);
  const [sort_by, setSortBy] = useState<SortByOption>(SortByOption.DUE_DESC);

  const search = (
    options: SearchOptions
  ): Promise<APIPredictions.EnhancedPrediction[]> => {
    const params = new URLSearchParams();

    if (options.statuses) {
      for (const status of options.statuses) {
        params.append("status", status);
      }
    }

    if (options.keyword) {
      params.append("keyword", options.keyword);
    }

    if (options.sort_by) {
      params.append("sort_by", options.sort_by);
    }

    if (options.predictor_id) {
      params.append("creator", options.predictor_id);
    }

    if (options.non_better_id) {
      params.append("unbetter", options.non_better_id);
    }

    if (options.page) {
      params.append("page", options.page.toString());
    }

    if (options.season_id) {
      params.append("season", options.season_id.toString());
    }

    return fetch("/api/predictions/search?" + params.toString()).then(
      responseHandler
    );
  };

  useEffect(() => {
    search({
      statuses: statuses.length > 0 ? statuses : undefined,
      sort_by,
    })
      .then((predictions) => {
        setPredictions(predictions);
      })
      .catch((err) => console.error(err));
  }, [statuses, sort_by]);

  useEffect(() => {
    search({
      sort_by: SortByOption.DUE_DESC,
    })
      .then((predictions) => {
        setPredictions(predictions);
      })
      .catch((err) => console.error(err));
  }, []);

  const setStatus = (
    newStatus: PredictionLifeCycle | "all",
    value: boolean
  ) => {
    const newStatuses: PredictionLifeCycle[] = [];

    if (newStatus === "all") {
      return setStatuses(newStatuses);
    }

    let found = false;

    for (const status of statuses) {
      if (status !== newStatus) {
        newStatuses.push(status);
        continue;
      }

      found = true;

      if (value) {
        newStatuses.push(status);
      }
    }

    if (!found) {
      newStatuses.push(newStatus);
    }

    setStatuses(newStatuses);
  };

  return {
    predictions,
    statuses: {
      all: allStatuses(statuses),
      [PredictionLifeCycle.OPEN]: findStatus(
        PredictionLifeCycle.OPEN,
        statuses
      ),
      [PredictionLifeCycle.CLOSED]: findStatus(
        PredictionLifeCycle.CLOSED,
        statuses
      ),
      [PredictionLifeCycle.RETIRED]: findStatus(
        PredictionLifeCycle.RETIRED,
        statuses
      ),
      [PredictionLifeCycle.SUCCESSFUL]: findStatus(
        PredictionLifeCycle.SUCCESSFUL,
        statuses
      ),
      [PredictionLifeCycle.FAILED]: findStatus(
        PredictionLifeCycle.FAILED,
        statuses
      ),
    },
    setStatus,
    sort_by,
    setSortBy,
  };
};
