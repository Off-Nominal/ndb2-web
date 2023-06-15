import { APIResponse } from "./api";
import { APIBets } from "./bets";

export enum PredictionLifeCycle {
  OPEN = "open",
  RETIRED = "retired",
  CLOSED = "closed",
  SUCCESSFUL = "successful",
  FAILED = "failed",
}

export const isPredictionLifeCycle = (val: any): val is PredictionLifeCycle => {
  if (typeof val !== "string") {
    return false;
  }

  return Object.values(PredictionLifeCycle).includes(
    val as PredictionLifeCycle
  );
};

export enum SortByOption {
  CREATED_ASC = "created_date-asc",
  CREATED_DESC = "created_date-desc",
  DUE_ASC = "due_date-asc",
  DUE_DESC = "due_date-desc",
  RETIRED_ASC = "retired_date-asc",
  RETIRED_DESC = "retired_date-desc",
  TRIGGERED_ASC = "triggered_date-asc",
  TRIGGERED_DESC = "triggered_date-desc",
  CLOSED_ASC = "closed_date-asc",
  CLOSED_DESC = "closed_date-desc",
  JUDGED_ASC = "judged_date-asc",
  JUDGED_DESC = "judged_date-desc",
}

export const isSortByOption = (val: any): val is SortByOption => {
  if (typeof val !== "string") {
    return false;
  }

  return Object.values(SortByOption).includes(val as SortByOption);
};

export type SearchOptions = {
  keyword?: string;
  page?: number;
  statuses?: PredictionLifeCycle[];
  sort_by?: SortByOption;
  predictor_id?: string;
  non_better_id?: string;
  season_id?: string;
};

export namespace APIPredictions {
  export type Vote = {
    id: string;
    vote: boolean;
    voted_date: string;
    voter: {
      id: string;
      discord_id: string;
    };
  };

  export type EnhancedPrediction = {
    id: number;
    predictor: {
      id: string;
      discord_id: string;
    };
    text: string;
    season_id: number;
    created_date: string;
    due_date: string;
    closed_date: string | null;
    triggered_date: string | null;
    triggerer: {
      id: string;
      discord_id: string;
    } | null;
    judged_date: string | null;
    retired_date: string | null;
    status: PredictionLifeCycle;
    bets: APIBets.Bet[];
    votes: Vote[];
    payouts: {
      endorse: number;
      undorse: number;
    };
  };

  export type ShortEnhancedPrediction = Omit<
    EnhancedPrediction,
    "bets" | "votes"
  > & {
    bets: {
      endorsements: number;
      undorsements: number;
      invalid: number;
    };
    votes: {
      yes: number;
      no: number;
    };
  };

  export type GetPredictionById = APIResponse<EnhancedPrediction>;

  export type SearchPredictions = APIResponse<ShortEnhancedPrediction>;
}
