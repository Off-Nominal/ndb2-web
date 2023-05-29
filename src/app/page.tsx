import { Card } from "@/components/Card";
import Image from "next/image";
import { Navigation } from "./components/Navigation";
import { redirect } from "next/navigation";
import ndb2API, { GetLeaderboardOptions } from "@/utils/ndb2";
import authAPI from "@/utils/auth";
import discordAPI from "@/utils/discord";

type Leader = {
  discordId: string;
  rank: number;
  avatarUrl: string;
  name: string;
  value: number | string;
};

// SERVER SIDE DATA FETCHING
async function getLeaderboards(): Promise<{
  s_points: Leader[];
  s_predictions: Leader[];
  s_bets: Leader[];
  at_points: Leader[];
  at_predictions: Leader[];
  at_bets: Leader[];
}> {
  const options: GetLeaderboardOptions = { cache: "no-cache" };

  const guildMemberManager = new discordAPI.GuildMemberManager();

  const s_pointsRes = ndb2API.getPointsLeaderboard({
    ...options,
    seasonIdentifier: "current",
  });
  const s_predictionsRes = ndb2API.getPredictionsLeaderboard({
    ...options,
    seasonIdentifier: "current",
  });
  const s_betsRes = ndb2API.getBetsLeaderboard({
    ...options,
    seasonIdentifier: "current",
  });
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

    const userLookup = await guildMemberManager.buildUserLookup([
      ...s_pointsLeaders.data.leaders.map((l) => l.discord_id),
      ...s_predictionsLeaders.data.leaders.map((l) => l.discord_id),
      ...s_betsLeaders.data.leaders.map((l) => l.discord_id),
      ...at_pointsLeaders.data.leaders.map((l) => l.discord_id),
      ...at_predictionsLeaders.data.leaders.map((l) => l.discord_id),
      ...at_betsLeaders.data.leaders.map((l) => l.discord_id),
    ]);

    return {
      s_points: s_pointsLeaders.data.leaders.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.points,
      })),
      s_predictions: s_predictionsLeaders.data.leaders.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.predictions.successful,
      })),
      s_bets: s_betsLeaders.data.leaders.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.bets.successful,
      })),
      at_points: at_pointsLeaders.data.leaders.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.points,
      })),
      at_predictions: at_predictionsLeaders.data.leaders.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.predictions.successful,
      })),
      at_bets: at_betsLeaders.data.leaders.map((l) => ({
        discordId: l.discord_id,
        rank: l.rank,
        avatarUrl: userLookup[l.discord_id]?.avatarUrl,
        name: userLookup[l.discord_id]?.name || "Unknown User",
        value: l.bets.successful,
      })),
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
