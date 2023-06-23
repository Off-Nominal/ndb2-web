import { useToast } from "@/app/contexts/toast";
import { RiskPill } from "@/components/RiskPill";
import { PredictionLifeCycle } from "@/types/predictions";
import { add, format, isAfter } from "date-fns";
import { BetInterface } from "./BetInterface";
import { APIBets } from "@/types/bets";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Timeline } from "@/components/Timeline";
import { ReactNode } from "react";

type PredictionListItemProps = {
  updateUserBet: (predictionId: number, endorsed: boolean) => Promise<void>;
  status: PredictionLifeCycle;
  id: number;
  text: ReactNode[];
  userBet: APIBets.UserBet | undefined;
  endorse_ratio: number;
  undorse_ratio: number;
  loading: boolean;
  discordId: string;
  createdDate: Date;
  dueDate: Date;
  closedDate: Date | null;
  triggeredDate: Date | null;
  retiredDate: Date | null;
  judgedDate: Date | null;
  endorsements: number;
  undorsements: number;
  yesVotes: number;
  noVotes: number;
};

export const PredictionListItem = (props: PredictionListItemProps) => {
  const { addToast } = useToast();

  let statusBackground = "bg-moonstone-blue";
  let showVotes = false;

  if (props.status === PredictionLifeCycle.RETIRED) {
    statusBackground = "bg-silver-chalice-grey";
  } else if (props.status === PredictionLifeCycle.CLOSED) {
    statusBackground = "bg-california-gold";
    showVotes = true;
  } else if (props.status === PredictionLifeCycle.SUCCESSFUL) {
    statusBackground = "bg-moss-green";
    showVotes = true;
  } else if (props.status === PredictionLifeCycle.FAILED) {
    statusBackground = "bg-deep-chestnut-red";
    showVotes = true;
  }

  const gridRows = showVotes ? "grid-rows-4" : "grid-rows-2";

  const handleBet = (endorsed: boolean) => {
    if (props.userBet) {
      if (props.userBet.endorsed === endorsed) {
        return;
      }

      if (
        isAfter(new Date(), add(new Date(props.userBet?.date), { hours: 12 }))
      ) {
        return addToast({
          message: "Bets can only be changed within 12 hours of being made.",
          type: "error",
        });
      }
    }

    props
      .updateUserBet(props.id, endorsed)
      .then(() => {
        addToast({
          message: "Bet successfully added",
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

  let betMessage;

  if (props.status !== PredictionLifeCycle.OPEN) {
    betMessage = "Predictions must be in OPEN status for bets to be made.";
  }

  return (
    <article
      id={"prediction-" + props.id}
      className={props.loading ? "animate-pulse" : ""}
    >
      <details className="group h-[7em] rounded-lg bg-slate-200 open:h-full dark:bg-slate-700">
        <summary className="flex h-full gap-4">
          <div
            className={
              statusBackground +
              " relative h-[7em] shrink-0 grow-0 basis-12 rounded-bl-lg rounded-tl-lg group-open:rounded-bl-none group-open:rounded-br-lg"
            }
          >
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 uppercase">
              {props.status.slice(0, 7)}
            </p>
          </div>
          <div className="hidden shrink-0 grow-0 sm:basis-32 md:block">
            <div className="mt-3 rounded-md border-slate-700 bg-slate-300 px-4 dark:border-slate-200 dark:bg-slate-500">
              <p className="w-full text-center text-xl">#{props.id}</p>
            </div>
            {props.status === PredictionLifeCycle.OPEN && (
              <div className="mt-3 rounded-md border-slate-700 bg-slate-300 px-2 py-1 dark:border-slate-200 dark:bg-slate-500">
                <p className="w-full text-center text-sm">
                  Due:
                  <br /> {format(props.dueDate, "MMM d, yyyy")}
                </p>
              </div>
            )}
          </div>
          <div className="relative h-[6em] grow basis-24 self-center overflow-hidden after:absolute after:bottom-0 after:right-0 after:h-[1.5em] after:w-3/4 after:bg-gradient-to-r after:from-white/0 after:to-slate-200/100 after:text-right group-open:mt-2 group-open:h-full group-open:self-start group-open:overflow-visible group-open:after:hidden dark:after:to-slate-700/100">
            <div className="w-full">
              <span className="mr-2 rounded-md bg-slate-300 px-1.5 py-0.5 dark:bg-slate-500 md:hidden">
                #{props.id}
              </span>
              {props.text}
            </div>
          </div>

          <BetInterface
            handleBet={handleBet}
            disabledMessage={betMessage}
            currentBet={props.userBet?.endorsed}
            containerClasses="overflow-hidden flex flex-col rounded-br-lg rounded-tr-lg h-[7em] shrink-0 grow-0 basis-12 group-open:rounded-bl-lg group-open:rounded-br-none"
          />
        </summary>
        <div className="mb-4 mt-8 flex gap-4">
          <div className=" grow-0 basis-12"></div>
          <div className="flex grow flex-col gap-8 md:flex-row md:items-start">
            <Timeline
              status={props.status}
              created_date={props.createdDate}
              due_date={props.dueDate}
              closed_date={props.closedDate}
              triggered_date={props.triggeredDate}
              retired_date={props.retiredDate}
              judged_date={props.judgedDate}
            />
            <div
              className={
                "grid grow basis-1/2 grid-cols-[auto,2rem,auto] gap-4 " +
                gridRows
              }
            >
              <div className="font-bold uppercase">Endorsements</div>
              <div className="flex justify-center">
                <div className="rounded-full bg-slate-400 px-2 dark:bg-slate-500">
                  <span>{props.endorsements}</span>
                </div>
              </div>
              <div className="flex justify-end">
                <RiskPill value={props.endorse_ratio} />
              </div>
              <div className="font-bold uppercase">Undorsements</div>
              <div className="flex justify-center">
                <div className="rounded-full bg-slate-400 px-2 dark:bg-slate-500">
                  <span>{props.undorsements}</span>
                </div>
              </div>
              <div className="flex justify-end">
                <RiskPill value={props.undorse_ratio} />
              </div>
              {showVotes && (
                <>
                  <div className="font-bold uppercase">Yes Votes</div>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-slate-400 px-2 dark:bg-slate-500">
                      <span>{props.yesVotes}</span>
                    </div>
                  </div>
                  <div></div>
                  <div className="font-bold uppercase">No Votes</div>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-slate-400 px-2 dark:bg-slate-500">
                      <span>{props.noVotes}</span>
                    </div>
                  </div>
                  <div></div>
                </>
              )}
            </div>
          </div>
          <div className=" grow-0 basis-12"></div>
        </div>
        <div className="flex justify-end p-6">
          <Link href={`/predictions/${props.id}`} prefetch={false}>
            <Button size="sm">More Details</Button>
          </Link>
        </div>
      </details>
    </article>
  );
};
