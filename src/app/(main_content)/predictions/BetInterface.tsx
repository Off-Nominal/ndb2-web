import { useToast } from "@/app/contexts/toast";
import { Triangle } from "@/components/Triangle";

type BetInterfaceProps = {
  handleBet: (endorsed: boolean) => void;
  disabledMessage: string | undefined;
  currentBet: boolean | undefined;
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

  let endorsedPolyClasses = props.currentBet === true ? "fill-moss-green" : "";

  if (!props.disabledMessage) {
    endorsedPolyClasses += " group-hover/endorse:fill-slate-300";
  }

  let undorsedPolyClasses =
    props.currentBet === false ? "fill-deep-chestnut-red" : "";

  if (!props.disabledMessage) {
    undorsedPolyClasses += " group-hover/undorse:fill-slate-300";
  }

  return (
    <div
      className={[
        "relative flex h-[7em] shrink-0 grow-0 basis-12 flex-col rounded-br-lg rounded-tr-lg bg-slate-400 group-open:rounded-bl-lg group-open:rounded-br-none dark:bg-slate-500 ",
        parentClasses,
      ].join(" ")}
    >
      <div
        className={[
          endorsedHoverClasses,
          "group/endorse flex grow items-center justify-center rounded-tr-lg",
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
            "fill-slate-300 stroke-slate-600 ",
            endorsedPolyClasses,
          ].join(" ")}
        />
      </div>
      <div
        className={[
          undorsedHoverClasses,
          "group/undorse flex grow items-center justify-center rounded-br-lg group-open:rounded-bl-lg group-open:rounded-br-none",
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
            "fill-slate-300 stroke-slate-600 origin-center rotate-180",
            undorsedPolyClasses,
          ].join(" ")}
        />
      </div>
    </div>
  );
};
