"use client";
import {
  APIPredictions,
  PredictionLifeCycle,
  SortByOption,
  isSortByOption,
} from "@/types/predictions";
import { usePredictionSearch } from "./usePredictionSearch";
import { CheckboxButtonList } from "@/components/CheckboxButtonList";
import { PredictionListItem } from "./PredictionListItem";
import { ShortDiscordGuildMember } from "@/types/discord";
import { Select } from "@/components/Select";
import { Autocomplete } from "@/components/Autocomplete";
import { Avatar } from "@/components/Avatar";
import { ReactNode, useState } from "react";
import { Button } from "@/components/Button";

export type SearchPredictionsProps = {
  discordId: string;
  bets: Omit<APIPredictions.Bet, "better_id">[];
  members: ShortDiscordGuildMember[];
};

export const SearchPredictions = (props: SearchPredictionsProps) => {
  const {
    keyword,
    predictions,
    statuses,
    setStatus,
    sort_by,
    setSortBy,
    setKeyword,
    searching,
    predictor_id,
    setPredictorId,
    showBetOpportunities,
    setShowBetOpportunities,
  } = usePredictionSearch(props.discordId, props.bets);
  const [members, setMembers] = useState<ShortDiscordGuildMember[]>(
    props.members
  );

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
      <section className="md:w-[675px]">
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
              Advanced Filter/Sort
            </h3>
            <div className="clip-triangle h-5 w-5 translate-x-1 -rotate-90 bg-slate-500 transition ease-in-out group-open:-translate-y-0.5 group-open:rotate-0 dark:bg-slate-200"></div>
          </summary>
          <h4 className="mt-4 text-center text-base uppercase">
            Filter By Status
          </h4>
          <div className="mt-4 flex justify-center">
            <div className="w-full">
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
          </div>

          <h4 className="mt-4 text-center text-base uppercase">Sort By Date</h4>
          <div className="mt-4">
            <div>
              <Select<string>
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
          </div>
          <h4 className="mt-4 text-center text-base uppercase">
            Filter by Predictor
          </h4>
          <div className="flex flex-col justify-between md:flex-row md:gap-8">
            <div className="mt-4 grow basis-8">
              <Autocomplete<ReactNode>
                value={predictor_id}
                onChange={(value: string) => setPredictorId(value)}
                onSearch={(searchTerm: string) => {
                  setMembers(
                    props.members.filter((m) => {
                      if (searchTerm === "") {
                        return true;
                      }
                      return m.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    })
                  );
                }}
                options={members
                  .sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }

                    return 0;
                  })
                  .map((m) => {
                    return {
                      label: (
                        <div className="flex grow gap-2">
                          <div className="shrink-0 grow-0 basis-8">
                            <Avatar src={m.avatarUrl} alt={m.name} size={24} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="overflow-hidden">{m.name}</p>
                          </div>
                        </div>
                      ),
                      value: m.discordId,
                    };
                  })}
              />
            </div>
            <div className="mt-4 grow basis-8">
              <CheckboxButtonList<string>
                items={[
                  {
                    name: "betOpps",
                    value: "true",
                    label: "Show My Bet Opportunities",
                    checked: showBetOpportunities,
                    onChange: (event) => {
                      setStatus(PredictionLifeCycle.OPEN, true);
                      setShowBetOpportunities(event.target.checked);
                    },
                  },
                ]}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-center md:mt-8 md:justify-end">
            <Button
              onClick={() => {
                setKeyword("");
                setStatus("all", true);
                setSortBy(SortByOption.DUE_ASC);
                setPredictorId("");
                setShowBetOpportunities(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </details>
      </section>
      <section className="my-8 flex flex-col gap-4">
        {predictions.length > 0 &&
          predictions.map((p) => {
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
                dueDate={new Date(p.due_date)}
                createdDate={new Date(p.created_date)}
                judgedDate={
                  p.judged_date !== null ? new Date(p.judged_date) : null
                }
                triggeredDate={
                  p.triggered_date !== null ? new Date(p.triggered_date) : null
                }
                closedDate={
                  p.closed_date !== null ? new Date(p.closed_date) : null
                }
                retiredDate={
                  p.retired_date !== null ? new Date(p.retired_date) : null
                }
              />
            );
          })}
      </section>
      {predictions.length === 0 && (
        <section className="md:w-[675px]">
          <div className="flex justify-center">
            <p className="text-center text-xl">
              No predictions found for your search criteria.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
