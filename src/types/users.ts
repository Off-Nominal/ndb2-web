import { APIResponse } from "./api";
import { APIPredictions } from "./predictions";

export namespace APIUsers {
  export type GetUserBetsByDiscordId = APIResponse<
    Omit<APIPredictions.Bet, "better_id">[]
  >;
}
