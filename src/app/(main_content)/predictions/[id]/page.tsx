import { redirect } from "next/navigation";
import { PillDisplay } from "@/components/PillDisplay";
import authAPI from "@/utils/auth";
import ndb2API from "@/utils/ndb2";
import discordAPI, { GuildMemberManager } from "@/utils/discord";
import { ShortDiscordGuildMember } from "@/types/discord";
import { APIPredictions, PredictionLifeCycle } from "@/types/predictions";
import { APIBets } from "@/types/bets";
import { Avatar } from "@/components/Avatar";
import { hydrateTextWithMemberHandles } from "../hydrateTextWithMemberHandles";
import { Metadata } from "next";
import ViewPrediction from "./ViewPrediction";
import { Card } from "@/components/Card";
import { List } from "@/components/List";
import { Empty } from "@/components/Empty";
import { VoteListItem } from "./VoteListItem";
import { APISeasons } from "@/types/seasons";

const defaultAvatarUrl = "https://cdn.discordapp.com/embed/avatars/0.png";

export type ListBet = Omit<APIBets.Bet, "better"> & {
  name: string;
  avatarUrl: string;
  better_discordId: string;
};

const generateBet = (
  bet: APIBets.Bet,
  member: ShortDiscordGuildMember
): ListBet => {
  return {
    id: bet.id,
    date: bet.date,
    wager: bet.wager,
    valid: bet.valid,
    payout: bet.payout,
    endorsed: bet.endorsed,
    season_payout: bet.season_payout,
    name: member.name,
    avatarUrl: member.avatarUrl,
    better_discordId: member.discordId,
  };
};

export type ListVote = Omit<APIPredictions.Vote, "voter"> & {
  name: string;
  avatarUrl: string;
  voter_discordId: string;
};

const generateVote = (
  vote: APIPredictions.Vote,
  member: ShortDiscordGuildMember | undefined
): ListVote => {
  return {
    id: vote.id,
    vote: vote.vote,
    voted_date: vote.voted_date,
    name: member?.name || "Unknown User",
    avatarUrl: member?.avatarUrl || defaultAvatarUrl,
    voter_discordId: member?.discordId || "",
  };
};

type PredictionsPageProps = {
  params: { id: string };
};

// SERVER SIDE DATA FETCHING

async function baseFetch(id: number) {
  const headers: RequestInit["headers"] = { cache: "no-store" };
  const guildMemberManager = new discordAPI.GuildMemberManager();

  const promises: [Promise<void>, Promise<APIPredictions.GetPredictionById>] = [
    guildMemberManager.initialize(),
    ndb2API.getPredictionById(id, headers),
  ];

  const results = await Promise.all(promises);
  const prediction = results[1].data;
  return { prediction, guildMemberManager };
}

export async function generateMetadata(
  props: PredictionsPageProps
): Promise<Metadata> {
  const id = parseInt(props.params.id);
  const { prediction, guildMemberManager } = await baseFetch(id);

  const member = await guildMemberManager.getMemberByDiscordId(
    prediction.predictor.discord_id
  );

  return {
    title: `Prediction #${prediction.id}`,
    description: `Predictions detail page for prediction #${prediction.id} by ${member.name}`,
    openGraph: {
      title: `Prediction #${prediction.id} by ${member.name}`,
      description: prediction.text,
      url: `https://ndb2.offnom.com/predictions/${id}`,
      siteName: "Nostradambot2",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Prediction #${prediction.id}`,
      description: `Predictions detail page for prediction #${prediction.id} by ${member.name}`,
      site: "@offnom",
      creator: "@JakeOnOrbit",
    },
  };
}

async function fetchData(id: number): Promise<{
  prediction: APIPredictions.EnhancedPrediction;
  predictor: ShortDiscordGuildMember;
  bets: ListBet[];
  votes: ListVote[];
  season: APISeasons.Season | undefined;
  members: ShortDiscordGuildMember[];
}> {
  let prediction: APIPredictions.EnhancedPrediction;
  let guildMemberManager: GuildMemberManager;
  let season: APISeasons.Season | undefined;

  try {
    const baseData = await baseFetch(id);
    const response = await ndb2API.getSeasons();
    prediction = baseData.prediction;
    guildMemberManager = baseData.guildMemberManager;
    console.log(prediction.season_id);
    season = response.data.find((s) => s.id === prediction.season_id);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch prediction data");
  }

  try {
    const members = guildMemberManager.getMembers();
    const userLookup = await guildMemberManager.buildUserLookup([
      ...Object.values(members).map((m) => m.discordId),
      ...prediction.bets.map((b) => b.better.discord_id),
    ]);
    const predictor = userLookup[prediction.predictor.discord_id];
    const bets = prediction.bets
      .filter((bet) => bet.valid)
      .map((bet) => generateBet(bet, userLookup[bet.better.discord_id]));

    const votes = prediction.votes.map((vote) =>
      generateVote(vote, userLookup[vote.voter.discord_id])
    );

    return {
      prediction,
      predictor,
      bets,
      votes,
      season,
      members: Object.values(members),
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch user infor");
  }
}

export default async function Predictions(props: PredictionsPageProps) {
  const id = parseInt(props.params.id);
  if (isNaN(id)) {
    return redirect("/predictions");
  }

  const payload = await authAPI.verify();

  if (!payload) {
    return redirect("/signin");
  }

  const { prediction, predictor, votes, bets, season, members } =
    await fetchData(id);

  const statusColor = {
    [PredictionLifeCycle.RETIRED]: "bg-silver-chalice-grey",
    [PredictionLifeCycle.SUCCESSFUL]: "bg-moss-green",
    [PredictionLifeCycle.FAILED]: "bg-deep-chestnut-red",
    [PredictionLifeCycle.OPEN]: "bg-moonstone-blue",
    [PredictionLifeCycle.CLOSED]: "bg-silver-chalice-grey",
  };

  const yesVotes = votes.filter((vote) => vote.vote);
  const noVotes = votes.filter((vote) => !vote.vote);

  const yesVoteArray = yesVotes.map((vote) => {
    return (
      <VoteListItem key={vote.id} name={vote.name} avatarUrl={vote.avatarUrl} />
    );
  });
  const noVoteArray = noVotes.map((vote) => {
    return (
      <VoteListItem key={vote.id} name={vote.name} avatarUrl={vote.avatarUrl} />
    );
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          <h2 className="text-xl uppercase sm:text-2xl md:basis-full">
            Prediction # {prediction.id}
          </h2>
          <div className="flex items-start gap-2 md:grow-[2]">
            <Avatar src={predictor.avatarUrl} size={24} alt={predictor.name} />
            <span className="text-slate-600 dark:text-slate-300">
              {predictor.name}
            </span>
          </div>
          <div className="md:grow-[1]">
            <span className="text-sm font-bold uppercase text-slate-600 dark:text-slate-300">
              Season:
            </span>
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">
              {season?.name || "Future Season"}
            </span>
          </div>
        </div>
        <div className="flex h-[64px] w-[136px]">
          <PillDisplay
            text={prediction.status.toUpperCase().slice(0, 7)}
            color={statusColor[prediction.status]}
            textSize="text-md"
            padding={"px-6 py-5"}
          />
        </div>
      </div>
      <div className="mt-8 rounded-xl bg-slate-300 p-4 dark:bg-slate-600">
        <p>{hydrateTextWithMemberHandles(prediction.text, members)}</p>
      </div>
      <ViewPrediction
        predictionId={prediction.id}
        status={prediction.status}
        created_date={prediction.created_date}
        due_date={prediction.due_date}
        closed_date={prediction.closed_date}
        triggered_date={prediction.triggered_date}
        judged_date={prediction.judged_date}
        retired_date={prediction.retired_date}
        bets={bets}
        endorseRatio={prediction.payouts.endorse}
        undorseRatio={prediction.payouts.undorse}
        user={payload}
      />
      <div className="mt-8">
        <h3 className="text-2xl uppercase">Votes</h3>
      </div>
      <div className="mt-4 flex flex-col gap-8 md:flex-row md:items-start">
        <Card
          header={
            <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
              Yes Votes
            </h2>
          }
          className="grow basis-4"
        >
          {yesVotes.length > 0 ? (
            <List items={yesVoteArray} />
          ) : (
            <Empty text="None" className="pb-6" />
          )}
        </Card>
        <Card
          header={
            <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
              No Votes
            </h2>
          }
          className="grow basis-4"
        >
          {noVotes.length > 0 ? (
            <List items={noVoteArray} />
          ) : (
            <Empty text="None" className="pb-6" />
          )}
        </Card>
      </div>
    </>
  );
}
