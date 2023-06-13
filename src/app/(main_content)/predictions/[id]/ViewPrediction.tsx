"use client";

import { Timeline } from "@/components/Timeline";
import { PredictionLifeCycle } from "@/types/predictions";
import { BetListItem } from "./BetListItem";
import { add, differenceInDays, format, isAfter } from "date-fns";
import { ListBet } from "./page";
import { PillDisplay } from "@/components/PillDisplay";
import { Card } from "@/components/Card";
import { List } from "@/components/List";
import { Empty } from "@/components/Empty";
import { useBets } from "./useBets";
import { BetInterface } from "../BetInterface";
import { useToast } from "@/app/contexts/toast";
import { AppJWTPayload } from "@/utils/auth";

const formatDate = (date: string) => {
  return format(new Date(date), "LLL do, yyyy");
};

export type ViewPredictionProps = {
  predictionId: number;
  status: PredictionLifeCycle;
  created_date: string;
  due_date: string;
  closed_date: string | null;
  triggered_date: string | null;
  retired_date: string | null;
  judged_date: string | null;
  bets: ListBet[];
  endorseRatio: number;
  undorseRatio: number;
  user: AppJWTPayload;
};

const listHeader = (
  <div className="flex gap-x-4 gap-y-1 font-bold uppercase">
    <div className="basis-9"></div>
    <p className="grow text-sm">User</p>
    <p className="shrink-0 basis-10 text-sm">Wager</p>
  </div>
);

export default function ViewPrediction(props: ViewPredictionProps) {
  const { addToast } = useToast();

  const { endorsements, undorsements, userBet, updateUserBet } = useBets(
    props.bets,
    props.user
  );

  const endorseArray = endorsements.map((bet) => {
    return (
      <BetListItem
        key={bet.id}
        date={formatDate(bet.date)}
        avatarUrl={bet.avatarUrl}
        name={bet.name}
        value={bet.wager}
      />
    );
  });

  const undorseArray = undorsements.map((bet) => {
    return (
      <BetListItem
        key={bet.id}
        date={formatDate(bet.date)}
        avatarUrl={bet.avatarUrl}
        name={bet.name}
        value={bet.wager}
      />
    );
  });

  const payoutRatio = userBet?.endorsed
    ? props.endorseRatio
    : props.undorseRatio;

  let betMessage;

  if (props.status !== PredictionLifeCycle.OPEN) {
    betMessage = "Predictions must be in OPEN status for bets to be made.";
  }

  const handleBet = (endorsed: boolean) => {
    if (userBet) {
      if (userBet.endorsed === endorsed) {
        return;
      }

      if (isAfter(new Date(), add(new Date(userBet?.date), { hours: 12 }))) {
        return addToast({
          message: "Bets can only be changed within 12 hours of being made.",
          type: "error",
        });
      }
    }

    updateUserBet(props.predictionId, endorsed)
      .then(() => {
        addToast({
          message: "Bet successfully updated",
          type: "success",
        });
      })
      .catch((err) => {
        addToast({
          message: err,
          type: "error",
        });
      });
  };

  return (
    <>
      <div className="mt-8 flex flex-col md:flex-row md:justify-between">
        <div>
          <Timeline
            status={props.status}
            created_date={new Date(props.created_date)}
            due_date={new Date(props.due_date)}
            closed_date={props.closed_date ? new Date(props.closed_date) : null}
            triggered_date={
              props.triggered_date ? new Date(props.triggered_date) : null
            }
            retired_date={
              props.retired_date ? new Date(props.retired_date) : null
            }
            judged_date={props.judged_date ? new Date(props.judged_date) : null}
          />
        </div>
        <div className="mt-8 flex flex-col gap-10">
          <div className="flex justify-between">
            {userBet ? (
              <div>
                <p>YOUR BET</p>
                <p>{`BET ON ${formatDate(userBet.date).toUpperCase()}`}</p>
              </div>
            ) : (
              <div>
                <p>ADD YOUR BET</p>
                <p>{`WAGER ${differenceInDays(
                  new Date(props.due_date),
                  new Date()
                )}`}</p>
              </div>
            )}
            <BetInterface
              handleBet={handleBet}
              currentBet={userBet?.endorsed}
              disabledMessage={betMessage}
              containerClasses="overflow-hidden flex rounded-full"
              endorseButtonClasses="pr-2 pl-5 py-3"
              undorseButtonClasses="pl-2 pr-5 py-3"
            />
          </div>
          {userBet && (
            <div className="flex justify-between">
              <div>
                <p>POTENTIAL POINTS</p>
                <p>GIVEN DUE DATE OF</p>
                <p>{formatDate(props.due_date).toUpperCase()}</p>
              </div>
              <div className="flex h-12">
                <PillDisplay
                  text={`+/- ${Math.min(
                    Math.floor(userBet.wager * payoutRatio),
                    1
                  )}`}
                  color={"bg-silver-chalice-grey"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h3>BETS</h3>
      </div>
      <div className="mt-4 flex flex-col gap-8 md:flex-row md:items-start">
        <Card title="Endorsements" className="grow basis-4">
          {endorsements.length > 0 ? (
            <List items={endorseArray} headerElement={listHeader} />
          ) : (
            <Empty text="No Endorsements for this bet" className="w-1/5 py-2" />
          )}
        </Card>
        <Card title="Undorsements" className="grow basis-4">
          {undorsements.length > 0 ? (
            <List items={undorseArray} headerElement={listHeader} />
          ) : (
            <Empty text="No Undorsements for this bet" className="w-1/5 py-2" />
          )}
        </Card>
      </div>
    </>
  );
}
