"use client";

import { Timeline } from "@/components/Timeline";
import { PredictionLifeCycle } from "@/types/predictions";
import { BetListItem } from "./BetListItem";
import { add, format, isAfter } from "date-fns";
import { ListBet } from "./page";
import { Card } from "@/components/Card";
import { List } from "@/components/List";
import { Empty } from "@/components/Empty";
import { useBets } from "./useBets";

import { useToast } from "@/app/contexts/toast";
import { AppJWTPayload } from "@/utils/auth";
import { RiskPill } from "@/components/RiskPill";
import UserBet from "./UserBet";

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
  <div className="flex font-bold uppercase gap-x-4 gap-y-1">
    <div className="basis-9"></div>
    <p className="text-sm grow">User</p>
    <p className="text-sm shrink-0 basis-10">Wager</p>
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
      <div className="flex flex-col mt-8 md:flex-row md:justify-between">
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
        <UserBet
          userBet={userBet}
          due_date={props.due_date}
          handleBet={handleBet}
          status={props.status}
          payoutRatio={payoutRatio}
        />
      </div>
      <div className="mt-8">
        <h3 className="text-2xl uppercase">Bets</h3>
      </div>
      <div className="mt-4 flex flex-col gap-8 md:flex-row md:items-start">
        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="order-1 text-center text-xl uppercase text-white sm:text-2xl">
                Endorsements
              </h2>
              <div className="order-2">
                <RiskPill value={props.endorseRatio} />
              </div>
            </div>
          }
          className="grow basis-4"
        >
          {endorsements.length > 0 ? (
            <List items={endorseArray} headerElement={listHeader} />
          ) : (
            <Empty text="None" className="pb-6" />
          )}
        </Card>
        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="order-1 text-center text-xl uppercase text-white sm:text-2xl md:order-2">
                Undorsements
              </h2>
              <div className="order-2 md:order-1">
                <RiskPill value={props.undorseRatio} />
              </div>
            </div>
          }
          className="grow basis-4"
        >
          {undorsements.length > 0 ? (
            <List items={undorseArray} headerElement={listHeader} />
          ) : (
            <Empty text="None" className="pb-6" />
          )}
        </Card>
      </div>
    </>
  );
}
