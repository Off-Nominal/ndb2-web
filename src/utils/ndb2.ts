import { APIPredictions, SearchOptions } from "@/types/predictions";
import { APIScores } from "@/types/scores";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { responseHandler } from "./misc";
import { APIUsers } from "@/types/users";
import { APISeasons } from "@/types/seasons";
import { APIBets } from "@/types/bets";

const API_URL = process.env.NDB2_API_BASEURL;
const API_KEY = process.env.NDB2_API_KEY;

const baseUrl = API_URL || "http://localhost:8000";
const headers = new Headers({
  Authorization: `Bearer ${API_KEY}`,
  "content-type": "application/json",
});

export type GetLeaderboardOptions = RequestInit & {
  seasonIdentifier?: "current" | "last" | number;
};

export enum NDB2APIErrorCode {
  SERVER_ERROR = 90000,
  AUTHENTICATION_ERROR = 90001,
  BAD_REQUEST = 90002,
  MALFORMED_BODY_DATA = 90003,
  MALFORMED_QUERY_PARAMS = 90004,
  INVALID_PREDICTION_STATUS = 90010,
  BETS_NO_CHANGE = 90501,
  BETS_UNCHANGEABLE = 90502,
}

type NDB2Response = {
  success: boolean;
  errorCode: NDB2APIErrorCode;
  message: string | null;
  data: any;
};

const isNDB2Error = (body: any): body is NDB2Response => {
  if (typeof body !== "object") {
    return false;
  }

  if (
    !("success" in body) ||
    !("errorCode" in body) ||
    !("message" in body) ||
    !("data" in body)
  ) {
    return false;
  }

  const { success, errorCode, message } = body;

  if (
    typeof success !== "boolean" ||
    typeof errorCode !== "number" ||
    (typeof message !== "string" && message !== null)
  ) {
    return false;
  }

  return true;
};

const handleNDB2Error = (res: Response, body: any) => {
  // console.log(body);
  if (res.status === 404) {
    return new Error("Resource Not Found");
  }

  if (!isNDB2Error(body) || !body.message) {
    return new Error(
      `Unexpected response from server, HTTP Status ${res.status}.`
    );
  }

  switch (body.errorCode) {
    case NDB2APIErrorCode.AUTHENTICATION_ERROR:
      return new Error(`Authentication Error`);
    case NDB2APIErrorCode.BAD_REQUEST:
      return new Error(
        `Bad Request, HTTP Status ${res.status}. Server Message: ${body.message}`
      );
    case NDB2APIErrorCode.MALFORMED_BODY_DATA:
      return new Error(
        `Malformed Body Data, HTTP Status ${res.status}. Server Message: ${body.message}`
      );
    case NDB2APIErrorCode.MALFORMED_QUERY_PARAMS:
      return new Error(
        `Malformed Query Params, HTTP Status ${res.status}. Server Message: ${body.message}`
      );
    case NDB2APIErrorCode.SERVER_ERROR:
      return new Error(
        `Server Error, HTTP Status ${res.status}. Server Message: ${body.message}`
      );
    case NDB2APIErrorCode.INVALID_PREDICTION_STATUS:
      return new Error(
        `You can't perform this action on a prediction with this status.`
      );
    case NDB2APIErrorCode.BETS_NO_CHANGE:
      return new Error(`You've already made this same bet.`);
    case NDB2APIErrorCode.BETS_UNCHANGEABLE:
      return new Error(
        `Bets cannot be changed once twelve hours have passed since the original bet.`
      );
    default:
      return new Error(
        `Unexpected response from server, HTTP Status ${res.status}.`
      );
  }
};

const errorHandler = (res: Response) => {
  return res.json().then((body) => {
    throw handleNDB2Error(res, body);
  });
};

const getPointsLeaderboard = (
  options?: GetLeaderboardOptions
): Promise<APIScores.GetPointsLeaderboard> => {
  let url: string = baseUrl + "/api/scores";
  if (options?.seasonIdentifier) {
    url += `/seasons/${options.seasonIdentifier}`;
  }
  url += "?view=points";

  return fetch(url, {
    headers,
    cache: options?.cache,
    next: options?.next,
  })
    .then(responseHandler)
    .catch(errorHandler);
};

const getBetsLeaderboard = (
  options?: GetLeaderboardOptions
): Promise<APIScores.GetBetsLeaderboard> => {
  let url: string = baseUrl + "/api/scores";
  if (options?.seasonIdentifier) {
    url += `/seasons/${options.seasonIdentifier}`;
  }
  url += "?view=bets";

  return fetch(url, {
    headers,
    cache: options?.cache,
    next: options?.next,
  })
    .then(responseHandler)
    .catch(errorHandler);
};

const getPredictionsLeaderboard = (
  options?: GetLeaderboardOptions
): Promise<APIScores.GetPredictionsLeaderboard> => {
  let url: string = baseUrl + "/api/scores";
  if (options?.seasonIdentifier) {
    url += `/seasons/${options.seasonIdentifier}`;
  }
  url += "?view=predictions";

  return fetch(url, {
    headers,
    cache: options?.cache,
    next: options?.next,
  })
    .then(responseHandler)
    .catch(errorHandler);
};

const getPredictionById = (
  id: number,
  options?: RequestInit
): Promise<APIPredictions.GetPredictionById> => {
  return fetch(baseUrl + `/api/predictions/${id}`, {
    headers,
    ...options,
  }).then((res) => res.json());
};

const searchPredictions = (
  options: SearchOptions
): Promise<APIPredictions.SearchPredictions> => {
  const url = new URL(`/api/predictions/search`, baseUrl);

  if (options.statuses) {
    for (const status of options.statuses) {
      url.searchParams.append("status", status);
    }
  }

  if (options.keyword) {
    url.searchParams.append("keyword", options.keyword);
  }

  if (options.sort_by) {
    url.searchParams.append("sort_by", options.sort_by);
  }

  if (options.predictor_id) {
    url.searchParams.append("creator", options.predictor_id);
  }

  if (options.non_better_id) {
    url.searchParams.append("unbetter", options.non_better_id);
  }

  if (options.page) {
    url.searchParams.append("page", options.page.toString());
  }

  if (options.season_id) {
    url.searchParams.append("season_id", options.season_id.toString());
  }

  return fetch(url, {
    headers,
  })
    .then(responseHandler)
    .catch(errorHandler);
};

const getUserBetsByDiscordId = (
  discordId: string
): Promise<APIUsers.GetUserBetsByDiscordId> => {
  return fetch(baseUrl + `/api/users/discord_id/${discordId}/bets`, {
    headers,
  })
    .then(responseHandler)
    .catch(errorHandler);
};

const getSeasons = (): Promise<APISeasons.GetSeasons> => {
  return fetch(baseUrl + `/api/seasons`, {
    headers,
  })
    .then(responseHandler)
    .catch(errorHandler);
};

const addBet = (
  predictionId: number,
  endorsed: boolean,
  discord_id: string
): Promise<APIBets.AddBet> => {
  const body = {
    endorsed,
    discord_id,
  };
  return fetch(baseUrl + `/api/predictions/${predictionId}/bets`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  })
    .then(responseHandler)
    .catch(errorHandler);
};

const ndb2API = {
  getPointsLeaderboard,
  getBetsLeaderboard,
  getPredictionsLeaderboard,
  getPredictionById,
  searchPredictions,
  getUserBetsByDiscordId,
  getSeasons,
  addBet,
};

export default ndb2API;
