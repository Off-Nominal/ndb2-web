import { useToast } from "@/app/contexts/toast";
import { Triangle } from "@/components/Triangle";

type BetInterfaceProps = {
  handleBet: (endorsed: boolean) => void;
  disabledMessage: string | undefined;
  currentBet: boolean | undefined;
  containerClasses?: string;
  endorseButtonClasses?: string;
  undorseButtonClasses?: string;
};

export const BetInterface = (props: BetInterfaceProps) => {
  const { addToast } = useToast();

  const parentClasses =
    props.disabledMessage !== undefined
      ? "cursor-not-allowed opacity-50"
      : "cursor-pointer";

  const endorsedHoverClasses =
    props.disabledMessage !== undefined ? "" : "hover:bg-moss-green";
  const undorsedHoverClasses =
    props.disabledMessage !== undefined ? "" : "hover:bg-deep-chestnut-red";

  let endorsedPolyClasses =
    props.currentBet === true ? "fill-moss-green" : "fill-slate-300";

  if (!props.disabledMessage) {
    endorsedPolyClasses += " group-hover/endorse:fill-slate-300";
  }

  let undorsedPolyClasses =
    props.currentBet === false ? "fill-deep-chestnut-red" : "fill-slate-300";

  if (!props.disabledMessage) {
    undorsedPolyClasses += " group-hover/undorse:fill-slate-300";
  }

  const endorseButtonClasses = props.endorseButtonClasses || "";
  const undorseButtonClasses = props.undorseButtonClasses || "";

  return (
    <div
      className={[
        "bg-slate-400 dark:bg-slate-500 ",
        parentClasses,
        props.containerClasses,
      ].join(" ")}
    >
      <div
        className={[
          "group/endorse flex grow items-center justify-center",
          endorsedHoverClasses,
          endorseButtonClasses,
        ].join(" ")}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          if (props.disabledMessage) {
            addToast({
              message: props.disabledMessage,
              type: "error",
            });
            return;
          }
          props.handleBet(true);
        }}
      >
        <Triangle
          canvasClassName="scale-75"
          polyClassName={[
            "stroke-slate-200 dark:stroke-slate-300 stroke-[0.5px]",
            endorsedPolyClasses,
          ].join(" ")}
        />
      </div>
      <div
        className={[
          "group/undorse flex grow items-center justify-center group-open:rounded-bl-lg group-open:rounded-br-none",
          undorsedHoverClasses,
          undorseButtonClasses,
        ].join(" ")}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          if (props.disabledMessage) {
            addToast({
              message: props.disabledMessage,
              type: "error",
            });
            return;
          }
          props.handleBet(false);
        }}
      >
        <Triangle
          canvasClassName="scale-75"
          polyClassName={[
            "stroke-slate-200 dark:stroke-slate-300 stroke-[0.5px] origin-center rotate-180",
            undorsedPolyClasses,
          ].join(" ")}
        />
      </div>
    </div>
  );
};
