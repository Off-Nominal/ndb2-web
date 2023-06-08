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
    <div className="flex h-12 w-32 rounded-full bg-silver-chalice-grey">
      <div className="border-r-1 flex grow items-center justify-center border-r-slate-600">
        <Triangle
          polyClassName={"hover:fill-moss-green"}
          onClick={() => console.log("Click")}
        />
      </div>
      <div className="flex grow items-center justify-center border-l-2 border-l-slate-600">
        <Triangle
          canvasClassName="rotate-180"
          polyClassName={"hover:fill-deep-chestnut-red"}
          onClick={() => console.log("Click")}
        />
      </div>
    </div>
  );
};
