import { Card } from "@/components/Card";
import Image from "next/image";
import { Navigation } from "./components/Navigation";
import { Ndb2Client } from "@/utils/ndb2";
import { AuthClient } from "@/utils/auth";
import { redirect } from "next/navigation";
import { APIScores } from "@/types/scores";

// SERVER SIDE DATA FETCHING
async function getLeaderboards(): Promise<{
  points: APIScores.PointsLeader[];
  predictions: APIScores.PredictionsLeader[];
  bets: APIScores.BetsLeader[];
}> {
  const ndb2Client = new Ndb2Client();

  const headers: RequestInit["headers"] = { cache: "no-store" };

  // const guildMembersRes = fetch()
  const pointsRes = ndb2Client.getPointsLeaderboard(headers);
  const predictionsRes = ndb2Client.getPredictionsLeaderboard(headers);
  const betsRes = ndb2Client.getBetsLeaderboard(headers);

  try {
    const [pointsLeaders, predictionsLeaders, betsLeaders] = await Promise.all([
      pointsRes,
      predictionsRes,
      betsRes,
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

const defaultAvatarUrl = "https://cdn.discordapp.com/embed/avatars/0.png";

const LeaderboardEntry = (props: LeaderboardEntryProps) => {
  return (
    <li>
      <div className="flex justify-evenly">
        <div>
          <p>{props.rank}</p>
        </div>
        <div>
          <Image
            className="rounded-full"
            src={props.avatarUrl || defaultAvatarUrl}
            width={24}
            height={24}
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
  const authClient = new AuthClient();
  const payload = await authClient.verify();

  if (!payload) {
    return redirect("/signin");
  }

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
                    name={"Discord Nickname"}
                    value={l.points}
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
                    name={"Discord Nickname"}
                    value={l.predictions.successful}
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
                    name={"Discord Nickname"}
                    value={l.bets.successful}
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
