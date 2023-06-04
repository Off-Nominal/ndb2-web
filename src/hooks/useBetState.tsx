import { APIPredictions, PredictionLifeCycle } from "@/types/predictions";
import { useState } from "react";

const useBetState = (predictionBets:APIPredictions.Bet[], discord_id: string, status: PredictionLifeCycle, prediction_id: number) => {
  const [bets, setBets] = useState(predictionBets)
  const userBet = undefined;
  const bet = (type: boolean) => {
    // open status of bet
    // already bet, check if within 12 hours of bet being made
    // otherwise make bet
  }

  return {bet, bets, userBet}
}

export default useBetState;