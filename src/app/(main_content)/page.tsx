import { Card } from "@/components/Card";
import ndb2API, { GetLeaderboardOptions } from "@/utils/ndb2";
import discordAPI from "@/utils/discord";
import { APIScores } from "@/types/scores";
import { List } from "@/components/List";
import { redirect } from "next/navigation";
import { getURLSearchParams, truncateText } from "@/utils/helpers";
import { cookies, headers } from "next/headers";
import authAPI from "@/utils/auth";
import { LeaderboardListItem } from "./LeaderboardListItem";

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
  const seasonOptions: GetLeaderboardOptions = {
    ...options,
    seasonIdentifier: "current",
  };

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

// FRONT END
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = cookies().get("token")?.value || "";
  const payload = await authAPI.verify(token);

  // user is not signed in, redirect to login
  if (!payload) {
    const queryString = getURLSearchParams(searchParams).toString();
    return redirect(
      "/signin?returnTo=" + encodeURIComponent("/" + queryString)
    );
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
    <>
      <h2 className="text-3xl">Season Stats</h2>
      <div className="my-8 flex flex-col justify-center gap-4 lg:flex-row">
        <Card
          header={
            <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
              Points
            </h2>
          }
          className="grow basis-4"
        >
          <List
            items={s_points.map((l) => {
              return (
                <LeaderboardListItem
                  key={l.discordId}
                  rank={l.rank}
                  name={truncateText(l.name, 20)}
                  value={l.value}
                  avatarUrl={l.avatarUrl}
                />
              );
            })}
          />
        </Card>
        <Card
          header={
            <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
              Predictions
            </h2>
          }
          className="grow basis-4"
        >
          <List
            items={s_predictions.map((l) => {
              return (
                <LeaderboardListItem
                  key={l.discordId}
                  rank={l.rank}
                  name={truncateText(l.name, 24)}
                  value={l.value}
                  avatarUrl={l.avatarUrl}
                />
              );
            })}
          />
        </Card>
        <Card
          header={
            <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
              Bets
            </h2>
          }
          className="grow basis-4"
        >
          <List
            items={s_bets.map((l) => {
              return (
                <LeaderboardListItem
                  key={l.discordId}
                  rank={l.rank}
                  name={truncateText(l.name, 20)}
                  value={l.value}
                  avatarUrl={l.avatarUrl}
                />
              );
            })}
          />
        </Card>
      </div>
      <h2>All-Time Stats</h2>
      <div className="my-8 flex flex-col justify-center gap-4 lg:flex-row">
        <Card
          header={
            <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
              Points
            </h2>
          }
          className="grow basis-4"
        >
          <List
            items={at_points.map((l) => {
              return (
                <LeaderboardListItem
                  key={l.discordId}
                  rank={l.rank}
                  name={truncateText(l.name, 20)}
                  value={l.value}
                  avatarUrl={l.avatarUrl}
                />
              );
            })}
          />
        </Card>
        <Card
          header={
            <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
              Predictions
            </h2>
          }
          className="grow basis-4"
        >
          <List
            items={at_predictions.map((l) => {
              return (
                <LeaderboardListItem
                  key={l.discordId}
                  rank={l.rank}
                  name={truncateText(l.name, 20)}
                  value={l.value}
                  avatarUrl={l.avatarUrl}
                />
              );
            })}
          />
        </Card>
        <Card
          header={
            <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
              Bets
            </h2>
          }
          className="grow basis-4"
        >
          <List
            items={at_bets.map((l) => {
              return (
                <LeaderboardListItem
                  key={l.discordId}
                  rank={l.rank}
                  name={truncateText(l.name, 20)}
                  value={l.value}
                  avatarUrl={l.avatarUrl}
                />
              );
            })}
          />
        </Card>
      </div>
    </>
  );
}
