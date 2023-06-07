import { useToast } from "@/app/contexts/toast";
import { Triangle } from "@/components/Triangle";

type BetInterfaceProps = {
  handleBet: (endorsed: boolean) => void;
  disabled: boolean;
  currentBet: boolean | undefined;
};

export const BetInterface = (props: BetInterfaceProps) => {
  const { addToast } = useToast();

  const backgroundColor = props.disabled
    ? "bg-slate-300"
    : "bg-silver-chalice-grey";

  const cursor = props.disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <div
      className={[
        "relative flex h-[7em] shrink-0 grow-0 basis-12 flex-col rounded-br-lg rounded-tr-lg group-open:rounded-bl-lg group-open:rounded-br-none ",
        backgroundColor,
      ].join(" ")}
    >
      <div className="flex grow items-center justify-center rounded-tr-lg">
        <Triangle
          hoverColor={props.disabled ? "none" : "moss-green"}
          fillColor={props.disabled ? "slate-400" : "white"}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            if (props.disabled) {
              addToast({
                message: "You cannot bet on this prediction.",
                type: "warning",
              });
              return;
            }
            props.handleBet(true);
          }}
          className={["scale-90", cursor].join(" ")}
        />
      </div>
      <div className="flex grow items-center justify-center rounded-br-lg group-open:rounded-bl-lg group-open:rounded-br-none">
        <Triangle
          hoverColor={props.disabled ? "none" : "moss-green"}
          fillColor={props.disabled ? "slate-200" : "white"}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            if (props.disabled) {
              addToast({
                message: "You cannot bet on this prediction.",
                type: "warning",
              });
              return;
            }
            props.handleBet(false);
          }}
          className={["rotate-180 scale-90", cursor].join(" ")}
        />
      </div>
    </div>
  );
};
