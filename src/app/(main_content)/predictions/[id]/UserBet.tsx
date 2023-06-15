import { format, differenceInDays, isAfter, add } from "date-fns";
import { BetInterface } from "../BetInterface";
import { PillDisplay } from "@/components/PillDisplay";
import { PredictionLifeCycle } from "@/types/predictions";

export type UserBetProps = {
  userBet:
    | {
        endorsed: boolean;
        wager: number;
        date: string;
      }
    | undefined;
  due_date: string;
  handleBet: (endorsed: boolean) => void;
  status: PredictionLifeCycle;
  payoutRatio: number;
};

const UserBet = (props: UserBetProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "LLL do, yyyy");
  };

  let betMessage: string | undefined;

  if (props.status !== PredictionLifeCycle.OPEN) {
    betMessage = "Predictions must be in OPEN status for bets to be made.";
  }

  let showBetInfo = false;
  let showAddBetInfo = false;
  let showBetInterface = false;
  let showbetEndorsed = false;
  let showPoints = false;

  if (props.status === PredictionLifeCycle.OPEN) {
    if (props.userBet) {
      const locked = isAfter(
        new Date(),
        add(new Date(props.userBet.date), { hours: 12 })
      );
      if (locked) {
        showBetInfo = true;
        showbetEndorsed = true;
        showPoints = true;
      } else {
        showBetInfo = true;
        showBetInterface = true;
        showPoints = true;
      }
    }
    if (!props.userBet) {
      showAddBetInfo = true;
      showBetInterface = true;
    }
  } else if (props.userBet) {
    showBetInfo = true;
    showbetEndorsed = true;
    if (props.status !== PredictionLifeCycle.RETIRED) {
      showPoints = true;
    }
  }

  return (
    <div className="flex flex-col gap-10 mt-8">
      <div className="flex justify-between gap-10">
        <div>
          {showBetInfo && props.userBet && (
            <>
              <p className="font-bold">YOUR BET</p>
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{`BET ON ${formatDate(props.userBet.date).toUpperCase()}`}</p>
            </>
          )}
          {showAddBetInfo && (
            <>
              <p className="font-bold">ADD YOUR BET</p>
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{`WAGER ${differenceInDays(
                new Date(props.due_date),
                new Date()
              )}`}</p>
            </>
          )}
        </div>
        {showBetInterface && (
          <BetInterface
            handleBet={props.handleBet}
            currentBet={props.userBet?.endorsed}
            disabledMessage={betMessage}
            containerClasses="overflow-hidden flex rounded-full"
            endorseButtonClasses="pr-2 pl-5 py-3"
            undorseButtonClasses="pl-2 pr-5 py-3"
          />
        )}
        {showbetEndorsed && props.userBet && (
          <div className="flex w-[136px] h-[64px]">
          <PillDisplay
            text={props.userBet.endorsed ? "ENDORSED" : "UNDORSED"}
            color={
              props.userBet.endorsed ? "bg-moss-green" : "bg-deep-chestnut-red"
            }
            textSize={"text-sm"}
            padding={"px-6 py-6"}
            

          />
            </div>
        )}
      </div>
      {showPoints && props.userBet && (
        <div className="flex justify-between gap-10">
          <div>
            <p className="font-bold uppercase">Potential Points</p>
            <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Given Due Date of {formatDate(props.due_date)}
            </p>
          </div>
          <div className="flex h-12">
            <PillDisplay
              text={`+/- ${Math.max(
                Math.floor(props.userBet.wager * props.payoutRatio),
                1
              )}`}
              color={"bg-silver-chalice-grey"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBet;
