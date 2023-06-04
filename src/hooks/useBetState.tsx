import { APIPredictions, PredictionLifeCycle } from "@/types/predictions";
import ndb2API from "@/utils/ndb2";
import { useState } from "react";

const useBetState = (predictionBets:APIPredictions.Bet[], discord_id: string, status: PredictionLifeCycle, prediction_id: number) => {
  const [bets, setBets] = useState(predictionBets)
  let userBet = bets.find((bet) => bet.better.discord_id === discord_id);
  const bet = async (type: boolean) => {
    if (status !== PredictionLifeCycle.OPEN) {
      console.log("Prediction is not open for bet")
      return false
    }
    const today = new Date()
    if (userBet) {
      const betTime = new Date(userBet.date)
      const betTimeDiffInSeconds = (today.getTime() - betTime.getTime())/1000;
      const betTimeDiffInHours = betTimeDiffInSeconds/3600;
      if(betTimeDiffInHours > 12 ) {
        console.log("Can't beat after 12 hours")
        return false
      }
    }
    userBet = {
      better: {id: 'test-thing', discord_id},
      date: today.toString(),
      endorsed: type,
      payout: 100,
      season_payout: 100,
      valid: true,
      wager: 14,
      id: "test"
    }
    const response = await ndb2API.postBet(prediction_id, {method: 'POST', body: JSON.stringify(userBet)})
    console.log(response)
    // already bet, check if within 12 hours of bet being made
    // otherwise make bet
  }

  return {bet, bets, userBet}
}

export default useBetState;