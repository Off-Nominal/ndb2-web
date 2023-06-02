"use client";
import {
  PredictionLifeCycle,
  SortByOption,
  isSortByOption,
} from "@/types/predictions";
import { usePredictionSearch } from "./usePredictionSearch";
import { CheckboxButtonList } from "@/components/CheckboxButtonList";
import { Select } from "@/components/Select";
import { PredictionListItem } from "./PredictionListItem";
import { useEffect } from "react";

export const SearchPredictions = () => {
  const {
    keyword,
    predictions,
    statuses,
    setStatus,
    sort_by,
    setSortBy,
    setKeyword,
    searching,
  } = usePredictionSearch();

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setStatus(name as PredictionLifeCycle, checked);
  };

  const handleSortBySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isSortByOption(event.target.value)) {
      return;
    }
    setSortBy(event.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <section>
        <h2 className="text-center text-xl uppercase">Search Predictions</h2>
        <div className="mb-6 mt-4">
          <input
            onChange={(event) => setKeyword(event.target.value)}
            value={keyword}
            placeholder="Keyword"
            className="w-full rounded-lg border-2 border-slate-300 bg-gradient-to-b from-slate-200 to-slate-300 px-4 py-2 focus-visible:outline-moonstone-blue dark:border-slate-600 dark:bg-slate-700 dark:from-slate-700 dark:to-slate-600"
          />
        </div>
        <details className="group">
          <summary className="flex items-center justify-center gap-6">
            <h3 className="text-center text-xl uppercase">
              Filter Status and Sort
            </h3>
            <div className="clip-select-arrow h-5 w-5 translate-x-1 -rotate-90 bg-slate-500 transition ease-in-out group-open:translate-y-1 group-open:rotate-0 dark:bg-slate-200"></div>
          </summary>
          <div className="my-4 flex justify-center">
            <CheckboxButtonList<PredictionLifeCycle | "all">
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
        </details>
      </section>
      <section className="my-8 flex flex-col gap-4">
        {predictions.map((p) => {
          const endorsed = p.bets?.find(
            (b) => b.better.discord_id === "444"
          )?.endorsed;

          return (
            <PredictionListItem
              loading={searching}
              key={p.id}
              text={p.text}
              id={p.id}
              status={p.status}
              endorsed={endorsed}
              endorse_ratio={p.payouts.endorse}
              undorse_ratio={p.payouts.undorse}
            />
          );
        })}
      </section>
    </div>
  );
};
