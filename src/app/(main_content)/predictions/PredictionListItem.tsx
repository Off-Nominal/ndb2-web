import { PredictionLifeCycle } from "@/types/predictions";
import { truncateText } from "@/utils/helpers";

type PredictionListItemProps = {
  status: PredictionLifeCycle;
  id: number;
  text: string;
  endorsed: boolean | undefined;
};

export const PredictionListItem = (props: PredictionListItemProps) => {
  let statusBackground = "bg-moonstone-blue";

  if (props.status === PredictionLifeCycle.RETIRED) {
    statusBackground = "bg-silver-chalice-grey";
  } else if (props.status === PredictionLifeCycle.CLOSED) {
    statusBackground = "bg-california-gold";
  } else if (props.status === PredictionLifeCycle.SUCCESSFUL) {
    statusBackground = "bg-moss-green";
  } else if (props.status === PredictionLifeCycle.FAILED) {
    statusBackground = "bg-deep-chestnut-red";
  }

  return (
    <article className="flex h-[7em] gap-4 rounded-lg bg-slate-200 dark:bg-slate-700">
      <div
        className={
          statusBackground + " relative shrink-0 grow-0 basis-12 rounded-l-lg"
        }
      >
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 uppercase">
          {props.status}
        </p>
      </div>
      <div className="hidden shrink-0 grow-0 sm:basis-24 md:block">
        <div className="rounded-md border-slate-700 bg-silver-chalice-grey px-4 dark:border-slate-200">
          #{props.id}
        </div>
      </div>
      <div className="relative h-[6em] grow basis-24 self-center overflow-hidden after:absolute after:bottom-0 after:right-0 after:h-[1.5em] after:w-3/4 after:bg-gradient-to-r after:from-white/0 after:to-slate-200/100 after:text-right dark:after:to-slate-700/100">
        <p className="w-full">
          <span className="mr-2 rounded-md bg-slate-500 px-1.5 py-0.5 md:hidden">
            #{props.id}
          </span>
          {props.text}
        </p>
      </div>
      <div className="flex shrink-0 grow-0 basis-12 flex-col">
        <div className="grow rounded-tr-lg bg-silver-chalice-grey"></div>
        <div className="grow rounded-br-lg bg-silver-chalice-grey"></div>
      </div>
    </article>
  );
};
