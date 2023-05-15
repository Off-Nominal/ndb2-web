const BASE_URL = process.env.NDB2_API_BASEURL;
const API_KEY = process.env.NDB2_API_KEY;

export class Ndb2Client {
  private baseUrl: string;
  private headers: { Authorization: string };

  constructor() {
    this.baseUrl = BASE_URL || "http://localhost:8000";
    this.headers = {
      Authorization: `Bearer ${API_KEY}`,
    };
  }

  public getLeaderboard(
    type: "points" | "predictions" | "bets",
    headers: RequestInit["headers"] = {}
  ) {
    const reqHeaders = new Headers({ ...this.headers, ...headers });

    return fetch(this.baseUrl + `/api/scores?view=${type}`, {
      headers: reqHeaders,
    }).then((res) => res.json());
  }
}
