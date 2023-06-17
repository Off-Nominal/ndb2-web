import { APIBets } from "@/types/bets";
import { PredictionLifeCycle } from "@/types/predictions";
import { useState } from "react";
import {add, isBefore} from "date-fns";

const useBetState = (predictionBets:APIBets.Bet[], discord_id: string, status: PredictionLifeCycle, prediction_id: number) => {
  const [bets, setBets] = useState(predictionBets)
  const userBet = bets.find((bet) => bet.better.discord_id === discord_id);
  const bet = async (type: boolean) => {
    //prediction cannot be bet on
    if (status !== PredictionLifeCycle.OPEN) {
      console.log("Prediction is not open for bet")
      throw new Error("Prediction is not open for bet")
    }

    const today = new Date()
    if (userBet) {
      //bet is the same as existing bet
      if (userBet.endorsed === type) {
        console.log("Bet is the same as current bet")
        throw new Error("Bet is the same as current bet")
      }
      // already bet, check if within 12 hours of bet being made
      const maxTime = add(new Date(userBet.date), {hours: 12})
      if(isBefore(maxTime, today) ) {
        console.log("Can't beat after 12 hours")
        throw new Error("Can't bet after 12 hours")
      }
    }
    
    const response = await fetch(`/api/predictions/${prediction_id}/bets`, {method: 'POST', body: JSON.stringify({discord_id, endorsed: type})})
    const currentBetState = await response.json()

    setBets(currentBetState.bets)
  }

  return {bet, bets, userBet}
}

export default useBetState;