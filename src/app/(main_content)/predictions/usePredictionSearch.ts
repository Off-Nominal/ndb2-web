import { APIBets } from "@/types/bets";
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
): Promise<APIPredictions.ShortEnhancedPrediction[]> => {
  const params = new URLSearchParams();

  if (options.page) {
    params.append("page", options.page.toString());
  }

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
    params.append("season_id", options.season_id);
  }

  return fetch("/api/predictions/search?" + params.toString()).then(
    responseHandler
  );
};

export const usePredictionSearch = (
  discordId: string,
  bets: APIBets.UserBet[]
) => {
  const [predictions, setPredictions] = useState<
    APIPredictions.ShortEnhancedPrediction[]
  >([]);

  // loading states
  const [searching, setSearching] = useState(false);
  const [incrementallySearching, setIncrementallySearching] = useState(false);
  const [reachedEndOfList, setReachedEndOfList] = useState(false);

  // Search Params States
  const [page, setPage] = useState(1);
  const [predictor_id, setPredictorId] = useState<string | undefined>("");
  const [keyword, setKeyword] = useState("");
  const [statuses, setStatuses] = useState<PredictionLifeCycle[]>([
    PredictionLifeCycle.OPEN,
  ]);
  const [sort_by, setSortBy] = useState<SortByOption>(SortByOption.DUE_ASC);
  const [season_id, setSeasonId] = useState<string | undefined>(undefined);
  const [showBetOpportunities, setShowBetOpportunities] = useState(false);

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const keywordRef = useRef(keyword);
  const pageRef = useRef(page);

  const incrementPage = () => {
    setPage((prev) => prev + 1);
  };

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

  const handleIncrementalSearch = useCallback(
    (options: SearchOptions) => {
      if (reachedEndOfList) {
        return;
      }
      setIncrementallySearching(true);
      search(options)
        .then((predictions) => {
          if (predictions.length === 0) {
            setReachedEndOfList(true);
            return;
          }
          setPredictions((prev) => [...prev, ...predictions]);
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setIncrementallySearching(false);
        });
    },
    [reachedEndOfList]
  );

  const debouncedSearch = useCallback((options: SearchOptions) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      handleSearch(options);
    }, 500);
  }, []);

  useEffect(() => {
    const options: SearchOptions = {
      keyword,
      page,
      statuses,
      sort_by,
      predictor_id,
      season_id,
      non_better_id: showBetOpportunities ? discordId : undefined,
    };

    if (keywordRef.current !== keyword) {
      keywordRef.current = keyword;
      debouncedSearch(options);
    } else if (pageRef.current !== page && page !== 1) {
      pageRef.current = page;
      handleIncrementalSearch(options);
    } else {
      handleSearch(options);
    }
  }, [
    keyword,
    statuses,
    sort_by,
    page,
    predictor_id,
    showBetOpportunities,
    discordId,
    season_id,
    handleIncrementalSearch,
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

  const clearFilters = () => {
    setKeyword("");
    setStatus("all", true);
    setSortBy(SortByOption.DUE_ASC);
    setPredictorId("");
    setShowBetOpportunities(false);
    setSeasonId(undefined);
    setPage(1);
  };

  const resetPages = () => {
    setPage(1);
    setReachedEndOfList(false);
  };

  return {
    predictions,
    searching,
    incrementallySearching,
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
    setShowBetOpportunities: (value: boolean) => {
      setShowBetOpportunities(value);
      resetPages();
    },
    setStatus: (newStatus: PredictionLifeCycle | "all", value: boolean) => {
      setStatus(newStatus, value);
      resetPages();
    },
    sort_by,
    setSortBy: (newSortBy: SortByOption) => {
      setSortBy(newSortBy);
      resetPages();
    },
    keyword,
    setKeyword: (newKeyword: string) => {
      setKeyword(newKeyword);
      resetPages();
    },
    predictor_id,
    setPredictorId: (newPredictorId: string) => {
      setPredictorId(newPredictorId);
      resetPages();
    },
    season_id,
    setSeasonId: (newSeasonId: string | undefined) => {
      setSeasonId(newSeasonId);
      resetPages();
    },
    clearFilters,
    incrementPage,
    reachedEndOfList,
  };
};
