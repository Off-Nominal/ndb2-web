import {
  APIPredictions,
  SearchOptions,
  SortByOption,
} from "@/types/predictions";
import { responseHandler } from "@/utils/misc";
import { useEffect, useState } from "react";

export const usePredictionSearch = () => {
  const [predictions, setPredictions] = useState<
    APIPredictions.EnhancedPrediction[]
  >([]);

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
      sort_by: SortByOption.DUE_DESC,
    })
      .then((predictions) => {
        setPredictions(predictions);
      })
      .catch((err) => console.error(err));
  }, []);

  return { predictions };
};
