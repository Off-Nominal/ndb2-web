import { APIResponse } from "./api";
import { APIPredictions } from "./predictions";

export namespace APIBets {
  export type Bet = {
    id: string;
    endorsed: boolean;
    date: string;
    wager: number;
    valid: boolean;
    payout: number;
    season_payout: number;
    better: {
      id: string;
      discord_id: string;
    };
  };

  export type UserBet = Omit<Bet, "better_id"> & { prediction_id: number };

  export type AddBet = APIResponse<APIPredictions.EnhancedPrediction>;
}
