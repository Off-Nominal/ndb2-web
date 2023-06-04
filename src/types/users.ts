import { APIResponse } from "./api";
import { APIBets } from "./bets";

export namespace APIUsers {
  export type GetUserBetsByDiscordId = APIResponse<APIBets.UserBet[]>;
}
