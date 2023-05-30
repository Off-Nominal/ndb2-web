import { Card } from "@/components/Card";
import Image from "next/image";
import { Navigation } from "./components/Navigation";
import { redirect } from "next/navigation";
import ndb2API, { GetLeaderboardOptions } from "@/utils/ndb2";
import authAPI from "@/utils/auth";
import discordAPI from "@/utils/discord";
import { APIScores } from "@/types/scores";

type Leader = {
  discordId: string;
  rank: number;
  avatarUrl: string;
  name: string;
  value: number | string;
};

const seasonLeaders: {
  points?: APIScores.PointsLeader[];
  predictions?: APIScores.PredictionsLeader[];
  bets?: APIScores.BetsLeader[];
} = {};
const allTimeLeaders: {
  points?: APIScores.PointsLeader[];
  predictions?: APIScores.PredictionsLeader[];
  bets?: APIScores.BetsLeader[];
} = {};

// SERVER SIDE DATA FETCHING
async function getLeaderboards(): Promise<{
  s_points: Leader[];
  s_predictions: Leader[];
  s_bets: Leader[];
  at_points: Leader[];
  at_predictions: Leader[];
  at_bets: Leader[];
}> {
  const guildMemberManager = new discordAPI.GuildMemberManager();

  const options: GetLeaderboardOptions = { cache: "no-cache" };
  const seasonOptions = { ...options, seasonIfentifier: "current" };

  const s_pointsRes = ndb2API.getPointsLeaderboard(seasonOptions);
  const s_predictionsRes = ndb2API.getPredictionsLeaderboard(seasonOptions);
  const s_betsRes = ndb2API.getBetsLeaderboard(seasonOptions);
  const at_pointsRes = ndb2API.getPointsLeaderboard(options);
  const at_predictionsRes = ndb2API.getPredictionsLeaderboard(options);
  const at_betsRes = ndb2API.getBetsLeaderboard(options);

  try {
    const [
      s_pointsLeaders,
      s_predictionsLeaders,
      s_betsLeaders,
      at_pointsLeaders,
      at_predictionsLeaders,
      at_betsLeaders,
    ] = await Promise.all([
      s_pointsRes,
      s_predictionsRes,
      s_betsRes,
      at_pointsRes,
      at_predictionsRes,
      at_betsRes,
      guildMemberManager.initialize(),
    ]);

    seasonLeaders.points = s_pointsLeaders.data.leaders;
    seasonLeaders.predictions = s_predictionsLeaders.data.leaders;
    seasonLeaders.bets = s_betsLeaders.data.leaders;
    allTimeLeaders.points = at_pointsLeaders.data.leaders;
    allTimeLeaders.predictions = at_predictionsLeaders.data.leaders;
    allTimeLeaders.bets = at_betsLeaders.data.leaders;
  } catch (err) {
    console.error(err);
    throw new Error(
      "There was an error fetching the data for the Leaderboards from the Nostradambot2 API."
    );
  }

  try {
    const userLookup = await guildMemberManager.buildUserLookup([
      ...seasonLeaders.points.map((l) => l.discord_id),
      ...seasonLeaders.predictions.map((l) => l.discord_id),
      ...seasonLeaders.bets.map((l) => l.discord_id),
      ...allTimeLeaders.points.map((l) => l.discord_id),
      ...allTimeLeaders.predictions.map((l) => l.discord_id),
      ...allTimeLeaders.bets.map((l) => l.discord_id),
    ]);

    return {
      s_points: seasonLeaders.points.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.points,
      })),
      s_predictions: seasonLeaders.predictions.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.predictions.successful,
      })),
      s_bets: seasonLeaders.bets.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.bets.successful,
      })),
      at_points: allTimeLeaders.points.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.points,
      })),
      at_predictions: allTimeLeaders.predictions.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.predictions.successful,
      })),
      at_bets: allTimeLeaders.bets.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.bets.successful,
      })),
    };
  } catch (err) {
    console.error(err);
    throw new Error(
      "There was an error fetching data from Discord about the users in the Leaderboards."
    );
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
  const payload = await authAPI.verify();

  if (!payload) {
    return redirect("/signin");
  }

  const {
    s_points,
    s_predictions,
    s_bets,
    at_points,
    at_predictions,
    at_bets,
  } = await getLeaderboards();

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
              {s_points.map((l) => {
                return (
                  <LeaderboardEntry
                    key={l.discordId}
                    rank={l.rank}
                    name={l.name}
                    value={l.value}
                    avatarUrl={l.avatarUrl}
                  />
                );
              })}
            </ul>
          </Card>
          <Card title="Predictions">
            <ul>
              {s_predictions.map((l) => {
                return (
                  <LeaderboardEntry
                    key={l.discordId}
                    rank={l.rank}
                    name={l.name}
                    value={l.value}
                    avatarUrl={l.avatarUrl}
                  />
                );
              })}
            </ul>
          </Card>
          <Card title="Bets">
            <ul>
              {s_bets.map((l) => {
                return (
                  <LeaderboardEntry
                    key={l.discordId}
                    rank={l.rank}
                    name={l.name}
                    value={l.value}
                    avatarUrl={l.avatarUrl}
                  />
                );
              })}
            </ul>
          </Card>
          <Card title="Points">
            <ul>
              {at_points.map((l) => {
                return (
                  <LeaderboardEntry
                    key={l.discordId}
                    rank={l.rank}
                    name={l.name}
                    value={l.value}
                    avatarUrl={l.avatarUrl}
                  />
                );
              })}
            </ul>
          </Card>
          <Card title="Predictions">
            <ul>
              {at_predictions.map((l) => {
                return (
                  <LeaderboardEntry
                    key={l.discordId}
                    rank={l.rank}
                    name={l.name}
                    value={l.value}
                    avatarUrl={l.avatarUrl}
                  />
                );
              })}
            </ul>
          </Card>
          <Card title="Bets">
            <ul>
              {at_bets.map((l) => {
                return (
                  <LeaderboardEntry
                    key={l.discordId}
                    rank={l.rank}
                    name={l.name}
                    value={l.value}
                    avatarUrl={l.avatarUrl}
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
