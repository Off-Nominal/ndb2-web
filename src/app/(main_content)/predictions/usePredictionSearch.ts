import { APIBets } from "@/types/bets";
import {
  APIPredictions,
  PredictionLifeCycle,
  SearchOptions,
  SortByOption,
} from "@/types/predictions";
import { responseHandler } from "@/utils/misc";
import { usePathname, useSearchParams } from "next/navigation";
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
          return res.json().then((response) => {
            if (res.ok) {
              return response;
            } else {
              throw response.error;
            }
          });
        })
        .then((prediction: APIPredictions.EnhancedPrediction) => {
          // update user bets state
          const newBets = [...userBets];
          const existingBetIndex = userBets.findIndex(
            (b) => b.prediction_id === predictionId
          );
          if (existingBetIndex >= 0) {
            const updatedBet = { ...newBets[existingBetIndex], endorsed };
            newBets[existingBetIndex] = updatedBet;
            setUserBets(newBets);
          } else {
            const newBet = prediction.bets.find(
              (b) => b.better.discord_id === discordId
            );
            if (newBet) {
              setUserBets([
                ...newBets,
                { ...newBet, prediction_id: prediction.id },
              ]);
            }
          }

          // update prediction state
          const existingPredictionIndex = predictions.findIndex(
            (p) => p.id === predictionId
          );
          if (existingPredictionIndex >= 0) {
            const newPredictions = [...predictions];
            newPredictions[existingPredictionIndex] = {
              ...prediction,
              bets: {
                endorsements: prediction.bets.filter(
                  (b) => b.endorsed && b.valid
                ).length,
                undorsements: prediction.bets.filter(
                  (b) => !b.endorsed && b.valid
                ).length,
                invalid: prediction.bets.filter((b) => !b.valid).length,
              },
              votes: {
                yes: prediction.votes.filter((v) => v.vote).length,
                no: prediction.votes.filter((v) => !v.vote).length,
              },
            };
            setPredictions(newPredictions);
          }
        });
    },
    [discordId, userBets, predictions]
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
    showBetOpportunities: searchParams.get("unbetter") !== null,
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

      if (status === PredictionLifeCycle.OPEN) {
        params.append("status", PredictionLifeCycle.CHECKING);
      }
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

    history.replaceState(history.state, "", `${pathname}?${params.toString()}`);
  }, [
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
    if (reachedEndOfList) {
      return;
    }
    setPage((prev) => prev + 1);
  }, [reachedEndOfList]);

  const handleSearch = useCallback(
    (options: SearchOptions) => {
      setSearching(true);
      search(options)
        .then((preds) => {
          if (preds.length < 10) {
            setReachedEndOfList(true);
          }
          setPredictions((prev) => {
            if (page === 1) {
              return preds;
            } else {
              return [...prev, ...preds];
            }
          });
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setSearching(false);
        });
    },
    [page]
  );

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

    if (reachedEndOfList) {
      return;
    }

    if (keywordRef.current !== keyword) {
      keywordRef.current = keyword;
      clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        handleSearch(options);
      }, 500);
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

  const resetPages = useCallback(() => {
    setPage(1);
    setReachedEndOfList(false);
  }, []);

  const clearFilters = useCallback(() => {
    setKeyword("");
    setStatus("all", true);
    setSortBy(SortByOption.DUE_ASC);
    setPredictorId("");
    setShowBetOpportunities(false);
    setSeasonId(undefined);
    resetPages();
  }, [setStatus, resetPages]);

  return {
    predictions: predictions.map((p) => ({
      ...p,
      userBet: userBets.find((b) => b.prediction_id === p.id) || false,
    })),
    updateUserBet,
    userBets,
    searching,
    incrementallySearching,
    statuses: {
      all: allStatuses(statuses),
      [PredictionLifeCycle.OPEN]: findStatus(
        PredictionLifeCycle.OPEN,
        statuses
      ),
      [PredictionLifeCycle.CHECKING]: findStatus(
        PredictionLifeCycle.CHECKING,
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
      if (value === true && predictor_id === discordId) {
        setPredictorId("");
      }
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
      if (newPredictorId === discordId) {
        setShowBetOpportunities(false);
      }
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
