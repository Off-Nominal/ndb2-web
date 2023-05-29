import { APIPredictions } from "@/types/predictions";
import { APIScores } from "@/types/scores";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

const API_URL = process.env.NDB2_API_BASEURL;
const API_KEY = process.env.NDB2_API_KEY;

const baseUrl = API_URL || "http://localhost:8000";
const headers = new Headers({
  Authorization: `Bearer ${API_KEY}`,
});

const getPointsLeaderboard = (
  options?: RequestInit
): Promise<APIScores.GetPointsLeaderboard> => {
  return fetch(baseUrl + `/api/scores?view=points`, {
    headers,
    ...options,
  }).then((res) => res.json());
};

const getBetsLeaderboard = (
  options?: RequestInit
): Promise<APIScores.GetBetsLeaderboard> => {
  return fetch(baseUrl + `/api/scores?view=bets`, {
    headers,
    ...options,
  }).then((res) => res.json());
};

const getPredictionsLeaderboard = (
  options?: RequestInit
): Promise<APIScores.GetPredictionsLeaderboard> => {
  return fetch(baseUrl + `/api/scores?view=predictions`, {
    headers,
    ...options,
  }).then((res) => res.json());
};

const getPredictionById = (
  id: Number,
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
