import { APIBets } from "@/types/bets";
import {
  APIPredictions,
  PredictionLifeCycle,
  SearchOptions,
  SortByOption,
} from "@/types/predictions";
import { responseHandler } from "@/utils/misc";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
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

  const [userBets, setUserBets] = useState<APIBets.UserBet[]>(bets);

  const updateUserBet = useCallback(
    (predictionId: number, endorsed: boolean) => {
      return fetch("/api/predictions/" + predictionId + "/bets", {
        method: "POST",
        body: JSON.stringify({ discord_id: discordId, endorsed }),
      })
        .then((res) => {
          return res.json().then((error) => {
            if (res.ok) {
              return;
            } else {
              throw error.error;
            }
          });
        })
        .then(() => {
          const newBets = [...userBets];
          const bet = newBets.find((b) => b.prediction_id === predictionId);

          if (bet) {
            bet.endorsed = endorsed;
            setUserBets([...userBets]);
          }
        });
    },
    [discordId, userBets]
  );

  // loading states
  const [searching, setSearching] = useState(false);
  const [incrementallySearching, setIncrementallySearching] = useState(false);
  const [reachedEndOfList, setReachedEndOfList] = useState(false);

  const searchParams = useSearchParams();

  // Initial search params
  const initialParams = {
    predictorId: searchParams.get("creator") || undefined,
    keyword: searchParams.get("keyword") || "",
    statuses: searchParams.getAll("status") as PredictionLifeCycle[],
    sort_by:
      (searchParams.get("sort_by") as SortByOption) || SortByOption.DUE_ASC,
    season_id: searchParams.get("season_id") || undefined,
    showBetOpportunities: searchParams.get("show_bet_opportunities") === "true",
  };

  // Search Params States
  const [page, setPage] = useState(1);
  const [predictor_id, setPredictorId] = useState<string | undefined>(
    initialParams.predictorId
  );
  const [keyword, setKeyword] = useState(initialParams.keyword);
  const [statuses, setStatuses] = useState<PredictionLifeCycle[]>(
    initialParams.statuses
  );
  const [sort_by, setSortBy] = useState<SortByOption>(initialParams.sort_by);
  const [season_id, setSeasonId] = useState<string | undefined>(
    initialParams.season_id
  );
  const [showBetOpportunities, setShowBetOpportunities] = useState(
    initialParams.showBetOpportunities
  );

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const keywordRef = useRef(keyword);
  const pageRef = useRef(page);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (keyword) {
      params.set("keyword", keyword);
    } else {
      params.delete("keyword");
    }

    params.delete("status");
    for (const status of statuses) {
      params.append("status", status);
    }

    params.set("sort_by", sort_by);

    if (predictor_id) {
      params.set("creator", predictor_id);
    } else {
      params.delete("creator");
    }

    if (season_id) {
      params.set("season_id", season_id);
    } else {
      params.delete("season_id");
    }

    if (showBetOpportunities) {
      params.set("unbetter", discordId);
    } else {
      params.delete("unbetter");
    }

    history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [
    router,
    pathname,
    searchParams,
    keyword,
    statuses,
    sort_by,
    predictor_id,
    showBetOpportunities,
    season_id,
    discordId,
  ]);

  const incrementPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const handleSearch = useCallback((options: SearchOptions) => {
    setSearching(true);
    search(options)
      .then((predictions) => {
        setPredictions(predictions);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setSearching(false);
      });
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
      clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        handleSearch(options);
      }, 500);
    } else if (pageRef.current !== page && page !== 1) {
      pageRef.current = page;
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
    handleSearch,
    reachedEndOfList,
  ]);

  const setStatus = useCallback(
    (newStatus: PredictionLifeCycle | "all", value: boolean) => {
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
    },
    [statuses]
  );

  const clearFilters = useCallback(() => {
    setKeyword("");
    setStatus("all", true);
    setSortBy(SortByOption.DUE_ASC);
    setPredictorId("");
    setShowBetOpportunities(false);
    setSeasonId(undefined);
    setPage(1);
  }, [setStatus]);

  const resetPages = useCallback(() => {
    setPage(1);
    setReachedEndOfList(false);
  }, []);

  return {
    predictions: predictions.map((p) => ({
      ...p,
      userBet: userBets.find((b) => b.prediction_id === p.id) || false,
    })),
    updateUserBet,
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
