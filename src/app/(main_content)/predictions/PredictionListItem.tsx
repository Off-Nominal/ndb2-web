import { useToast } from "@/app/contexts/toast";
import { RiskPill } from "@/components/RiskPill";
import { Triangle } from "@/components/Triangle";
import { PredictionLifeCycle } from "@/types/predictions";
import { format } from "date-fns";
import { BetInterface } from "./BetInterface";

type PredictionListItemProps = {
  updateUserBet: (predictionId: number, endorsed: boolean) => Promise<void>;
  status: PredictionLifeCycle;
  id: number;
  text: string;
  endorsed: boolean | undefined;
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

enum TimelineStatus {
  COMPLETE = "complete",
  COMPLETE_NEGATIVE = "complete_negative",
  IN_PROGRESS = "in_progress",
  NOT_STARTED = "not_started",
  CANCELLED = "cancelled",
}

type TimelineItem = {
  label: string;
  value: string;
  status: TimelineStatus;
};

const buildTimeline = (
  status: PredictionLifeCycle,
  createdDate: Date,
  dueDate: Date,
  closedDate: Date | null,
  triggeredDate: Date | null,
  retiredDate: Date | null,
  judgedDate: Date | null
): [TimelineItem, TimelineItem, TimelineItem, TimelineItem] => {
  const dateFormat = "MMM do, yyyy";

  const item1: TimelineItem = {
    label: "Created",
    value: format(createdDate, dateFormat),
    status: TimelineStatus.COMPLETE,
  };

  let item2: TimelineItem;

  if (status === PredictionLifeCycle.OPEN) {
    item2 = {
      label: "Due",
      value: format(dueDate, dateFormat),
      status: TimelineStatus.IN_PROGRESS,
    };
  } else if (status === PredictionLifeCycle.RETIRED && retiredDate) {
    item2 = {
      label: "Retired",
      value: format(retiredDate, dateFormat),
      status: TimelineStatus.COMPLETE_NEGATIVE,
    };
  } else {
    item2 = {
      label: "Triggered",
      value: triggeredDate ? format(triggeredDate, dateFormat) : "",
      status: TimelineStatus.COMPLETE,
    };
  }

  let item3: TimelineItem;

  if (status === PredictionLifeCycle.OPEN) {
    item3 = {
      label: "Close",
      value: "",
      status: TimelineStatus.NOT_STARTED,
    };
  } else if (status === PredictionLifeCycle.RETIRED) {
    item3 = {
      label: "Due",
      value: format(dueDate, dateFormat),
      status: TimelineStatus.CANCELLED,
    };
  } else {
    item3 = {
      label: "Eff. Close",
      value: closedDate ? format(closedDate, dateFormat) : "",
      status: TimelineStatus.COMPLETE,
    };
  }

  let item4: TimelineItem;

  if (status === PredictionLifeCycle.OPEN) {
    item4 = {
      label: "Judgement",
      value: "",
      status: TimelineStatus.NOT_STARTED,
    };
  } else if (status === PredictionLifeCycle.RETIRED) {
    item4 = {
      label: "Judgement",
      value: "",
      status: TimelineStatus.CANCELLED,
    };
  } else {
    item4 = {
      label: "Judged",
      value: judgedDate ? format(judgedDate, dateFormat) : "",
      status: TimelineStatus.COMPLETE,
    };
  }

  return [item1, item2, item3, item4];
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

  const timeline = buildTimeline(
    props.status,
    props.createdDate,
    props.dueDate,
    props.closedDate,
    props.triggeredDate,
    props.retiredDate,
    props.judgedDate
  );

  const timelineStatusClasses = {
    complete: "bg-moss-green",
    complete_negative: "bg-deep-chestnut-red",
    in_progress: "bg-moonstone-blue",
    not_started: "bg-silver-chalice-grey",
    cancelled: "bg-slate-300 dark:bg-slate-500",
  };

  const handleBet = (endorsed: boolean) => {
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
          <div className="hidden shrink-0 grow-0 sm:basis-24 md:block">
            <div className="mt-3 rounded-md border-slate-700 bg-slate-300 px-4 dark:border-slate-200 dark:bg-slate-500">
              <p className="w-full text-center text-xl">#{props.id}</p>
            </div>
          </div>
          <div className="relative h-[6em] grow basis-24 self-center overflow-hidden after:absolute after:bottom-0 after:right-0 after:h-[1.5em] after:w-3/4 after:bg-gradient-to-r after:from-white/0 after:to-slate-200/100 after:text-right group-open:mt-2 group-open:h-full group-open:self-start group-open:overflow-visible group-open:after:hidden dark:after:to-slate-700/100">
            <p className="w-full">
              <span className="mr-2 rounded-md bg-slate-300 px-1.5 py-0.5 dark:bg-slate-500 md:hidden">
                #{props.id}
              </span>
              {props.text}
            </p>
          </div>
          <BetInterface
            handleBet={handleBet}
            disabledMessage={betMessage}
            currentBet={props.endorsed}
          />
        </summary>
        <div className="mb-4 mt-8 flex gap-4">
          <div className=" grow-0 basis-12"></div>
          <div className="flex grow flex-col gap-8 md:flex-row md:items-start">
            <div className="grid grow basis-1/2 grid-cols-[2rem,auto,130px] grid-rows-4 gap-4">
              {/* Date 1 */}
              <div className="flex items-start justify-center">
                <div
                  className={
                    "rounded-full px-2 " +
                    timelineStatusClasses[timeline[0].status]
                  }
                >
                  <span className="opacity-0">o</span>
                </div>
              </div>
              <div className="font-bold uppercase">{timeline[0].label}</div>
              <div className="flex justify-end">{timeline[0].value}</div>
              {/* Date 2 */}
              <div className="flex items-start justify-center">
                <div
                  className={
                    "rounded-full px-2 " +
                    timelineStatusClasses[timeline[1].status]
                  }
                >
                  <span className="opacity-0">o</span>
                </div>
              </div>
              <div className="font-bold uppercase">{timeline[1].label}</div>
              <div className="flex justify-end">{timeline[1].value}</div>
              {/* Date 3 */}
              <div className="flex items-start justify-center">
                <div
                  className={
                    "rounded-full px-2 " +
                    timelineStatusClasses[timeline[2].status]
                  }
                >
                  <span className="opacity-0">o</span>
                </div>
              </div>
              <div className="font-bold uppercase">{timeline[2].label}</div>
              <div className="flex justify-end">{timeline[2].value}</div>
              {/* Date 4 */}
              <div className="flex items-start justify-center">
                <div
                  className={
                    "rounded-full px-2 " +
                    timelineStatusClasses[timeline[3].status]
                  }
                >
                  <span className="opacity-0">o</span>
                </div>
              </div>
              <div className="font-bold uppercase">{timeline[3].label}</div>
              <div className="flex justify-end">{timeline[3].value}</div>
            </div>
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
          {/* <Link href={`/predictions/${props.id}`}>
            <Button size="sm">More Details</Button>
          </Link> */}
        </div>
      </details>
    </article>
  );
};
