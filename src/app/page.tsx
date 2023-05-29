import { Card } from "@/components/Card";
import Image from "next/image";
import { Navigation } from "./components/Navigation";
import { redirect } from "next/navigation";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import ndb2API from "@/utils/api";
import authAPI from "@/utils/auth";
import discordAPI, { ShortDiscordGuildMember } from "@/utils/discord";

type Leader = {
  discordId: string;
  rank: number;
  avatarUrl: string;
  name: string;
  value: number | string;
};

// SERVER SIDE DATA FETCHING
async function getLeaderboards(): Promise<{
  points: Leader[];
  predictions: Leader[];
  bets: Leader[];
}> {
  const options: RequestInit = { cache: "no-cache" };

  const guildMemberManager = new discordAPI.GuildMemberManager();

  const pointsRes = ndb2API.getPointsLeaderboard(options);
  const predictionsRes = ndb2API.getPredictionsLeaderboard(options);
  const betsRes = ndb2API.getBetsLeaderboard(options);

  try {
    const [pointsLeaders, predictionsLeaders, betsLeaders] = await Promise.all([
      pointsRes,
      predictionsRes,
      betsRes,
      guildMemberManager.initialize(),
    ]);

    const usersArray = [];

    for (const leader of pointsLeaders.data.leaders) {
      usersArray.push(
        guildMemberManager.getMemberByDiscordId(leader.discord_id)
      );
    }

    return Promise.all(usersArray).then((users) => {
      const usersLookup: Record<string, ShortDiscordGuildMember> = {};

      for (const user of users) {
        usersLookup[user.discordId] = user;
      }

      return {
        points: pointsLeaders.data.leaders.map((l) => ({
          discordId: l.discord_id,
          rank: l.rank,
          avatarUrl: usersLookup[l.discord_id]?.avatarUrl,
          name: usersLookup[l.discord_id]?.name,
          value: l.points,
        })),
        predictions: predictionsLeaders.data.leaders.map((l) => ({
          discordId: l.discord_id,
          rank: l.rank,
          avatarUrl: usersLookup[l.discord_id]?.avatarUrl,
          name: usersLookup[l.discord_id]?.name,
          value: l.predictions.successful,
        })),
        bets: betsLeaders.data.leaders.map((l) => ({
          discordId: l.discord_id,
          rank: l.rank,
          avatarUrl: usersLookup[l.discord_id]?.avatarUrl,
          name: usersLookup[l.discord_id]?.name,
          value: l.bets.successful,
        })),
      };
    });
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
              {predictions.map((l) => {
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
              {bets.map((l) => {
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
