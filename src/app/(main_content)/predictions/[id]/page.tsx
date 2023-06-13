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
  members: ShortDiscordGuildMember[];
}> {
  let prediction: APIPredictions.EnhancedPrediction;
  let guildMemberManager: GuildMemberManager;

  try {
    const baseData = await baseFetch(id);
    prediction = baseData.prediction;
    guildMemberManager = baseData.guildMemberManager;
  } catch (err) {
    throw new Error("Failed to fetch prediction data");
  }

  try {
    const userLookup = await guildMemberManager.buildUserLookup(
      prediction.bets.map((bet) => bet.better.discord_id)
    );
    const members = guildMemberManager.getMembers();
    const predictor = userLookup[prediction.predictor.discord_id];
    const bets = prediction.bets
      .filter((bet) => bet.valid)
      .map((bet) => generateBet(bet, userLookup[bet.better.discord_id]));

    return {
      prediction,
      predictor,
      bets,
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

  const { prediction, predictor, bets, members } = await fetchData(id);

  const statusColor = {
    [PredictionLifeCycle.RETIRED]: "bg-silver-chalice-grey",
    [PredictionLifeCycle.SUCCESSFUL]: "bg-moss-green",
    [PredictionLifeCycle.FAILED]: "bg-deep-chestnut-red",
    [PredictionLifeCycle.OPEN]: "bg-moonstone-blue",
    [PredictionLifeCycle.CLOSED]: "bg-silver-chalice-grey",
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl uppercase sm:text-2xl">
            Prediction # {prediction.id}
          </h2>
          <div className="flex items-start gap-2">
            <Avatar src={predictor.avatarUrl} size={24} alt={predictor.name} />
            <span className="text-slate-600 dark:text-slate-300">
              {predictor.name}
            </span>
          </div>
        </div>
        <PillDisplay
          text={prediction.status.toUpperCase().slice(0, 7)}
          color={statusColor[prediction.status]}
        />
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
    </>
  );
}
