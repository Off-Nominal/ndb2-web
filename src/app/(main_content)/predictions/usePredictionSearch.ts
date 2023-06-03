import {
  APIPredictions,
  PredictionLifeCycle,
  SearchOptions,
  SortByOption,
} from "@/types/predictions";
import { responseHandler } from "@/utils/misc";
import { useCallback, useEffect, useRef, useState } from "react";

const findStatus = (
  status: PredictionLifeCycle,
  statuses: PredictionLifeCycle[]
): boolean => {
  return statuses.find((s) => s === status) !== undefined;
};

const allStatuses = (statuses: PredictionLifeCycle[]): boolean => {
  return statuses.length === 5 || statuses.length === 0;
};

const search = (
  options: SearchOptions
): Promise<APIPredictions.EnhancedPrediction[]> => {
  const params = new URLSearchParams();

  if (options.statuses) {
    for (const status of options.statuses) {
      params.append("status", status);
    }
  }

  if (options.non_better_id) {
    params.append("unbetter", options.non_better_id);
  }

  if (options.predictor_id) {
    params.append("creator", options.predictor_id);
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

export const usePredictionSearch = (
  discordId: string,
  bets: Omit<APIPredictions.Bet, "better_id">[]
) => {
  const [predictions, setPredictions] = useState<
    APIPredictions.EnhancedPrediction[]
  >([]);

  // Search Params States
  const [searching, setSearching] = useState(false);
  const [predictor_id, setPredictorId] = useState<string | undefined>("");
  const [keyword, setKeyword] = useState("");
  const [statuses, setStatuses] = useState<PredictionLifeCycle[]>([]);
  const [sort_by, setSortBy] = useState<SortByOption>(SortByOption.DUE_ASC);
  const [showBetOpportunities, setShowBetOpportunities] = useState(false);

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const keywordRef = useRef(keyword);

  const handleSearch = (options: SearchOptions) => {
    setSearching(true);
    search(options)
      .then((predictions) => {
        setPredictions(predictions);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setSearching(false);
      });
  };

  const debouncedSearch = useCallback((options: SearchOptions) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      handleSearch(options);
    }, 500);
  }, []);

  useEffect(() => {
    const options: SearchOptions = {
      keyword,
      statuses,
      sort_by,
      predictor_id,
      non_better_id: showBetOpportunities ? discordId : undefined,
    };

    if (keywordRef.current !== keyword) {
      keywordRef.current = keyword;
      debouncedSearch(options);
    } else {
      handleSearch(options);
    }
  }, [
    keyword,
    statuses,
    sort_by,
    predictor_id,
    showBetOpportunities,
    discordId,
    debouncedSearch,
  ]);

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
    showBetOpportunities,
    setShowBetOpportunities,
    setStatus,
    sort_by,
    setSortBy,
    keyword,
    setKeyword,
    searching,
    predictor_id,
    setPredictorId,
  };
};
