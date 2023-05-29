import { APIPredictions } from "@/types/predictions";
import { APIScores } from "@/types/scores";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

const API_URL = process.env.NDB2_API_BASEURL;
const API_KEY = process.env.NDB2_API_KEY;

const baseUrl = API_URL || "http://localhost:8000";
const headers = new Headers({
  Authorization: `Bearer ${API_KEY}`,
});

export type GetLeaderboardOptions = RequestInit & {
  seasonIdentifier?: "current" | "last" | number;
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
  }).then((res) => res.json());
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
  }).then((res) => res.json());
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
  }).then((res) => res.json());
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

const ndb2API = {
  getPointsLeaderboard,
  getBetsLeaderboard,
  getPredictionsLeaderboard,
  getPredictionById,
};

export default ndb2API;
