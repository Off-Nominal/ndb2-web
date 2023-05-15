import { Card } from "@/components/Card";
import { verify } from "@/utils/auth";
import { AppError, AppErrors } from "@/utils/errors";
import Image from "next/image";
import { Navigation } from "./components/Navigation";

const BASE_URL = process.env.NDB2_API_BASEURL;
const API_KEY = process.env.NDB2_API_KEY;

const headers = new Headers({
  Authorization: `Bearer ${API_KEY}`,
});

type Leader = {
  id: string;
  rank: number;
  value: number;
  discord_id: string;
};

// SERVER SIDE DATA FETCHING
async function getLeaderboards(): Promise<{
  points: Leader[];
  predictions: Leader[];
  bets: Leader[];
}> {
  // Auth check
  try {
    await verify();
  } catch (err) {
    throw new AppError(AppErrors.AUTH_INVALID_SIGNATURE);
  }

  const pointsRes = fetch(BASE_URL + "/api/scores?view=points", { headers });
  const predictionsRes = fetch(BASE_URL + "/api/scores?view=predictions", {
    headers,
  });
  const betsRes = fetch(BASE_URL + "/api/scores?view=bets", { headers });

  try {
    const responses = await Promise.all([pointsRes, predictionsRes, betsRes]);
    const [pointsLeaders, predictionsLeaders, betsLeaders] = await Promise.all([
      responses[0].json(),
      responses[1].json(),
      responses[2].json(),
    ]);
    return {
      points: pointsLeaders.data.leaders,
      predictions: predictionsLeaders.data.leaders,
      bets: betsLeaders.data.leaders,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch leaderboard data");
  }
}

type LeaderboardEntryProps = {
  rank: number;
  avatarUrl: string;
  name: string;
  value: number | string;
};

const LeaderboardEntry = (props: LeaderboardEntryProps) => {
  return (
    <li>
      <div className="flex justify-evenly">
        <div>
          <p>{props.rank}</p>
        </div>
        <div>
          <Image
            src={props.avatarUrl}
            alt={`Avatar photo for user ${props.name}`}
          />
        </div>
        <div>
          <p>{props.name}</p>
        </div>
        <div>
          <p>{props.value}</p>
        </div>
      </div>
    </li>
  );
};

// FRONT END
export default async function Home() {
  const { points, predictions, bets } = await getLeaderboards();

  return (
    <div className="flex h-full w-full flex-col content-center p-8 align-middle">
      <nav className="mb-8 mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="h-min text-center text-3xl sm:text-4xl md:text-5xl">
          NOSTRADAMBOT<span className={"text-moonstone-blue"}>2</span>
        </h1>
        <Navigation />
      </nav>
      <main>
        <div className="flex flex-wrap justify-center gap-4">
          <Card title="Points">
            <ul>
              {points.map((l) => {
                return (
                  <LeaderboardEntry
                    key={l.discord_id}
                    rank={l.rank}
                    name={"Name"}
                    value={l.value}
                    avatarUrl=""
                  />
                );
              })}
            </ul>
          </Card>
          <Card title="Predictions">
            <ul>
              {predictions.map((l) => {
                return (
                  <LeaderboardEntry
                    key={l.discord_id}
                    rank={l.rank}
                    name={"Name"}
                    value={l.value}
                    avatarUrl=""
                  />
                );
              })}
            </ul>
          </Card>
          <Card title="Bets">
            <ul>
              {bets.map((l) => {
                return (
                  <LeaderboardEntry
                    key={l.discord_id}
                    rank={l.rank}
                    name={"Name"}
                    value={l.value}
                    avatarUrl=""
                  />
                );
              })}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
