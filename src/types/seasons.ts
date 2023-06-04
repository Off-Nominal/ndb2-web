import { APIResponse } from "./api";

export namespace APISeasons {
  export type Season = {
    id: number;
    name: string;
    start: string;
    end: string;
    wager_cap: number;
  };

  export type EnhancedSeason = Season & {
    identifier: "current" | "past" | "future";
  };

  export type GetSeasons = APIResponse<EnhancedSeason[]>;
}
