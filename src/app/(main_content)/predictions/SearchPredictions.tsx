"use client";
import { PredictionLifeCycle, SortByOption } from "@/types/predictions";
import { usePredictionSearch } from "./usePredictionSearch";
import { CheckboxButtonList } from "@/components/CheckboxButtonList";
import { Select } from "@/components/Select";
import { PredictionListItem } from "./PredictionListItem";

export const SearchPredictions = () => {
  const { predictions, statuses, setStatus, sort_by } = usePredictionSearch();

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setStatus(name as PredictionLifeCycle, checked);
  };

  const handleSortBySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
  };

  return (
    <>
      <section>
        <h3 className="text-center text-xl uppercase">
          Filter Status and Sort
        </h3>
        <div className="my-4 flex justify-center">
          <CheckboxButtonList
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
        </div>
        <div>
          <Select
            value={sort_by}
            onChange={handleSortBySelect}
            options={[
              {
                label: "Created Date, Most Recent first",
                value: SortByOption.CREATED_DESC,
              },
              {
                label: "Created Date, Oldest first",
                value: SortByOption.CREATED_ASC,
              },
              {
                label: "Due Date, Soonest first",
                value: SortByOption.DUE_ASC,
              },
              {
                label: "Due Date, Furthest first",
                value: SortByOption.DUE_DESC,
              },
              {
                label: "Retired Date, Most Recent first",
                value: SortByOption.RETIRED_DESC,
              },
              {
                label: "Retired Date, Oldest first",
                value: SortByOption.RETIRED_ASC,
              },
              {
                label: "Triggered Date, Most Recent first",
                value: SortByOption.TRIGGERED_DESC,
              },
              {
                label: "Triggered Date, Oldest first",
                value: SortByOption.TRIGGERED_ASC,
              },
              {
                label: "Closed Date, Most Recent first",
                value: SortByOption.CLOSED_DESC,
              },
              {
                label: "Closed Date, Oldest first",
                value: SortByOption.CLOSED_ASC,
              },
              {
                label: "Judged Date, Most Recent first",
                value: SortByOption.JUDGED_DESC,
              },
              {
                label: "Judged Date, Oldest first",
                value: SortByOption.JUDGED_ASC,
              },
            ]}
          />
        </div>
      </section>
      <section className="my-8 flex flex-col gap-4">
        {predictions.map((p) => {
          const endorsed = p.bets?.find(
            (b) => b.better.discord_id === "444"
          )?.endorsed;

          return (
            <PredictionListItem
              key={p.id}
              text={p.text}
              id={p.id}
              status={p.status}
              endorsed={endorsed}
            />
          );
        })}
      </section>
    </>
  );
};
