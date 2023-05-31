"use client";
import { PredictionLifeCycle } from "@/types/predictions";
import { usePredictionSearch } from "./usePredictionSearch";
import { CheckboxButtonList } from "@/components/CheckboxButtonList";

export const SearchPredictions = () => {
  const { predictions, statuses, setStatus } = usePredictionSearch();

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setStatus(name as PredictionLifeCycle, checked);
  };

  return (
    <>
      <section>
        <h3 className="text-xl uppercase">Filter Status and Sort</h3>
        <CheckboxButtonList
          // itemClassName="min-w-[120px]"
          items={[
            {
              name: "all",
              value: "all",
              label: "All",
              checked: statuses.all,
              onChange: handleStatusChange,
            },
            {
              name: "open",
              value: PredictionLifeCycle.OPEN,
              label: "Open",
              checked: statuses.open,
              onChange: handleStatusChange,
            },
            {
              name: "closed",
              value: PredictionLifeCycle.CLOSED,
              label: "Voting",
              checked: statuses.closed,
              onChange: handleStatusChange,
            },
            {
              name: "retired",
              value: PredictionLifeCycle.RETIRED,
              label: "Retired",
              checked: statuses.retired,
              onChange: handleStatusChange,
            },
            {
              name: "successful",
              value: PredictionLifeCycle.SUCCESSFUL,
              label: "Successful",
              checked: statuses.successful,
              onChange: handleStatusChange,
            },
            {
              name: "failed",
              value: PredictionLifeCycle.FAILED,
              label: "Failed",
              checked: statuses.failed,
              onChange: handleStatusChange,
            },
          ]}
        />
      </section>
      <section className="my-8">
        {predictions.map((p) => (
          <article key={p.id}>
            <h2 className="text-lg">{p.predictor.discord_id}</h2>
            <p>{p.text}</p>
          </article>
        ))}
      </section>
    </>
  );
};
