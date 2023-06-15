type RiskPillProps = {
  value: number;
};

const getRisk = (value: number) => {
  let risk = " - EVEN";
  let color = "bg-california-gold";

  if (value > 1.25) {
    risk = " - HIGH";
    color = "bg-deep-chestnut-red";
  }

  if (value < 0.75) {
    risk = " - LOW";
    color = "bg-moss-green";
  }

  return { color, risk };
};

export const RiskPill = (props: RiskPillProps) => {
  const { color, risk } = getRisk(props.value);
  return (
    <div
      className={
        "flex w-full max-w-[120px] justify-center rounded-full px-4 shadow-lg " +
        color
      }
    >
      <span
        data-after={risk}
        className={`lg:after:w-auto lg:after:content-[attr(data-after)]`}
      >
        {props.value.toFixed(2)}
      </span>
    </div>
  );
};
