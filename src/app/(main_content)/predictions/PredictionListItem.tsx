import { Button } from "@/components/Button";
import { RiskPill } from "@/components/RiskPill";
import { PredictionLifeCycle } from "@/types/predictions";
import Link from "next/link";

type PredictionListItemProps = {
  status: PredictionLifeCycle;
  id: number;
  text: string;
  endorsed: boolean | undefined;
  endorse_ratio: number;
  undorse_ratio: number;
};

export const PredictionListItem = (props: PredictionListItemProps) => {
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

  let gridRows = showVotes ? "grid-rows-4" : "grid-rows-2";

  return (
    <article className="">
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
          <div className="flex h-[7em] shrink-0 grow-0 basis-12 flex-col">
            <div className="grow rounded-tr-lg bg-silver-chalice-grey"></div>
            <div className="grow rounded-br-lg bg-silver-chalice-grey group-open:rounded-bl-lg group-open:rounded-br-none"></div>
          </div>
        </summary>
        <div className="mb-4 mt-8 flex gap-4">
          <div className=" grow-0 basis-12"></div>
          <div className="flex grow flex-col md:flex-row">
            <div className="grow basis-1/2 ">Timeline</div>
            <div
              className={
                "grid grow basis-1/2 grid-cols-[auto,2rem,auto] gap-4 " +
                gridRows
              }
            >
              <div className="font-bold uppercase">Endorsements</div>
              <div className="flex justify-center">
                <div className="rounded-full bg-slate-400 px-2 dark:bg-slate-500">
                  <span>14</span>
                </div>
              </div>
              <div className="flex justify-end">
                <RiskPill value={props.endorse_ratio} />
              </div>
              <div className="font-bold uppercase">Undorsements</div>
              <div className="flex justify-center">
                <div className="rounded-full bg-slate-400 px-2 dark:bg-slate-500">
                  <span>24</span>
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
                      <span>4</span>
                    </div>
                  </div>
                  <div></div>
                  <div className="font-bold uppercase">No Votes</div>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-slate-400 px-2 dark:bg-slate-500">
                      <span>4</span>
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
          <Link href={`/predictions/${props.id}`}>
            <Button size="sm">More Details</Button>
          </Link>
        </div>
      </details>
    </article>
  );
};
