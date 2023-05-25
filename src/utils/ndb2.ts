import { APIPredictions } from "@/types/predictions";
import { APIScores } from "@/types/scores";

const API_URL = process.env.NDB2_API_BASEURL;
const API_KEY = process.env.NDB2_API_KEY;

export class Ndb2Client {
  private baseUrl: string;
  private headers: { Authorization: string };

  constructor() {
    this.baseUrl = API_URL || "http://localhost:8000";
    this.headers = {
      Authorization: `Bearer ${API_KEY}`,
    };
  }

  public getPointsLeaderboard(
    headers: RequestInit["headers"] = {}
  ): Promise<APIScores.GetPointsLeaderboard> {
    const reqHeaders = new Headers({ ...this.headers, ...headers });

    return fetch(this.baseUrl + `/api/scores?view=points`, {
      headers: reqHeaders,
    }).then((res) => res.json());
  }

  public getBetsLeaderboard(
    headers: RequestInit["headers"] = {}
  ): Promise<APIScores.GetBetsLeaderboard> {
    const reqHeaders = new Headers({ ...this.headers, ...headers });

    return fetch(this.baseUrl + `/api/scores?view=bets`, {
      headers: reqHeaders,
    }).then((res) => res.json());
  }

  public getPredictionsLeaderboard(
    headers: RequestInit["headers"] = {}
  ): Promise<APIScores.GetPredictionsLeaderboard> {
    const reqHeaders = new Headers({ ...this.headers, ...headers });

    return fetch(this.baseUrl + `/api/scores?view=predictions`, {
      headers: reqHeaders,
    }).then((res) => res.json());
  }

  public getPredictionById(
    id: Number,
    headers: RequestInit["headers"] = {}
  ): Promise<APIPredictions.GetPredictionById> {
    const reqHeaders = new Headers({ ...this.headers, ...headers });

    return fetch(this.baseUrl + `/api/predictions/${id}`, {
      headers: reqHeaders,
    }).then((res) => res.json());
  }
}
