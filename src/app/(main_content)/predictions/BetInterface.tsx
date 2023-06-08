import { useToast } from "@/app/contexts/toast";
import { Triangle } from "@/components/Triangle";

type BetInterfaceProps = {
  handleBet: (endorsed: boolean) => void;
  disabledMessage: string | undefined;
  currentBet: boolean | undefined;
};

export const BetInterface = (props: BetInterfaceProps) => {
  const { addToast } = useToast();

  const backgroundColor = props.disabledMessage
    ? "bg-slate-300 stroke-slate-500"
    : "bg-silver-chalice-grey stroke-slate-700";

  const polyClasses = props.disabledMessage
    ? "cursor-not-allowed stroke-slate-400 fill-slate-400"
    : "cursor-pointer hover:fill-moss-green fill-slate-300 stroke-slate-700";

  const endorsedBetStateClasses =
    props.currentBet === true ? "bg-moss-green" : "";

  const undorsedBetStateClasses =
    props.currentBet === false ? "bg-deep-chestnut-red" : "";

  return (
    <div
      className={[
        "relative flex h-[7em] shrink-0 grow-0 basis-12 flex-col rounded-br-lg rounded-tr-lg group-open:rounded-bl-lg group-open:rounded-br-none ",
        backgroundColor,
      ].join(" ")}
    >
      <div
        className={[
          "flex grow items-center justify-center rounded-tr-lg",
          endorsedBetStateClasses,
        ].join(" ")}
      >
        <Triangle
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
          polyClassName={[polyClasses].join(" ")}
        />
      </div>
      <div
        className={[
          "flex grow items-center justify-center rounded-br-lg group-open:rounded-bl-lg group-open:rounded-br-none",
          undorsedBetStateClasses,
        ].join(" ")}
      >
        <Triangle
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
          polyClassName={["origin-center rotate-180", polyClasses].join(" ")}
        />
      </div>
    </div>
  );
};
