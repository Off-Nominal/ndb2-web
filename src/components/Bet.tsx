"use client";

import useBetState from "@/hooks/useBetState";
import { APIBets } from "@/types/bets";
import { PredictionLifeCycle } from "@/types/predictions";
import { Triangle } from "./Triangle";

type BetProps = {
  bets: APIBets.Bet[];
  discord_id: string;
  status: PredictionLifeCycle;
  prediction_id: number;
};

export const Bet = (props: BetProps) => {
  const { bet, bets, userBet } = useBetState(
    props.bets,
    props.discord_id,
    props.status,
    props.prediction_id
  );

  return (
    <div className="flex w-32 h-12 rounded-full bg-silver-chalice-grey">
      <div className="flex items-center justify-center border-r-1 grow border-r-slate-600">
        <Triangle endorse={true} onClick={() => console.log("Click")} />
      </div>
      <div className="flex items-center justify-center border-l-2 grow border-l-slate-600">
        <Triangle
          className="rotate-180"
          endorse={false}
          onClick={() => console.log("Click")}
        />
      </div>
    </div>
  );
};
