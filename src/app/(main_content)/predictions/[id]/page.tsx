import { redirect } from "next/navigation";

import React from "react";

import { Card } from "@/components/Card";
import { Timeline } from "@/components/Timeline";
import { PillDisplay } from "@/components/PillDisplay";
import { Bet } from "@/components/Bet";

import authAPI from "@/utils/auth";
import ndb2API from "@/utils/ndb2";
import discordAPI, { GuildMemberManager } from "@/utils/discord";
import { ShortDiscordGuildMember } from "@/types/discord";
import { differenceInDays, format } from "date-fns";
import { APIPredictions, PredictionLifeCycle } from "@/types/predictions";
import { APIBets } from "@/types/bets";
import { Avatar } from "@/components/Avatar";
import { List } from "@/components/List";
import { hydrateTextWithMemberHandles } from "../hydrateTextWithMemberHandles";
import { Metadata } from "next";

type ListBet = Omit<APIBets.Bet, "better"> & {
  name: string;
  avatarUrl: string;
};

const formatDate = (date: string) => {
  return format(new Date(date), "LLL do, yyyy");
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
  endorsements: ListBet[];
  undorsements: ListBet[];
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
    const endorsements = prediction.bets
      .filter((bet) => bet.endorsed)
      .map((bet) => generateBet(bet, userLookup[bet.better.discord_id]));
    const undorsements = prediction.bets
      .filter((bet) => !bet.endorsed)
      .map((bet) => generateBet(bet, userLookup[bet.better.discord_id]));

    return {
      prediction,
      predictor,
      endorsements,
      undorsements,
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

  const { prediction, predictor, endorsements, undorsements, members } =
    await fetchData(id);

  const userBet = prediction.bets.find(
    (bet) => bet.better.discord_id === payload.discordId
  );

  const payoutRatio = userBet
    ? userBet.endorsed
      ? prediction.payouts.endorse
      : prediction.payouts.undorse
    : 1;

  const statusColor = {
    [PredictionLifeCycle.RETIRED]: "bg-silver-chalice-grey",
    [PredictionLifeCycle.SUCCESSFUL]: "bg-moss-green",
    [PredictionLifeCycle.FAILED]: "bg-deep-chestnut-red",
    [PredictionLifeCycle.OPEN]: "bg-moonstone-blue",
    [PredictionLifeCycle.CLOSED]: "bg-silver-chalice-grey",
  };

  type PredictionsEntryProps = {
    date: string;
    avatarUrl: string;
    name: string;
    value: number | string;
  };

  const defaultAvatarUrl = "https://cdn.discordapp.com/embed/avatars/0.png";

  const PredictionsEntry = (props: PredictionsEntryProps) => {
    return (
      <div className="flex items-center">
        <div className="flex grow">
          <div className="mx-2 shrink-0 grow-0 basis-8">
            <Avatar
              src={props.avatarUrl || defaultAvatarUrl}
              alt={`Avatar photo for user ${props.name}`}
              size={30}
            />
          </div>
          <div className="mx-2 grow">
            <span>{props.name}</span>
          </div>
        </div>
        <div className="flex shrink-0 grow-0 basis-32">
          <span>{props.date}</span>
        </div>
        <div className="ml-2 shrink-0 grow-0 basis-10">
          <span>{props.value.toLocaleString("en-US")}</span>
        </div>
      </div>
    );
  };

  const endorseArray = endorsements.map((bet) => {
    return (
      <PredictionsEntry
        key={bet.id}
        date={formatDate(bet.date)}
        avatarUrl={bet.avatarUrl}
        name={bet.name}
        value={bet.wager}
      />
    );
  });

  const listHeader = (
    <div className="flex">
      <p className="grow text-sm font-bold uppercase">User</p>
      <p className="shrink-0 grow-0 basis-32 text-left text-sm font-bold uppercase">
        Bet Date
      </p>
      <p className="shrink-0 grow-0 basis-10 text-sm font-bold uppercase">
        Wager
      </p>
    </div>
  );

  const undorseArray = undorsements.map((bet) => {
    return (
      <PredictionsEntry
        key={bet.id}
        date={formatDate(bet.date)}
        avatarUrl={bet.avatarUrl}
        name={bet.name}
        value={bet.wager}
      />
    );
  });

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
      <div className="mt-8 flex flex-col md:flex-row md:justify-between">
        <div>
          <Timeline
            status={prediction.status}
            created_date={new Date(prediction.created_date)}
            due_date={new Date(prediction.due_date)}
            closed_date={
              prediction.closed_date ? new Date(prediction.closed_date) : null
            }
            triggered_date={
              prediction.triggered_date
                ? new Date(prediction.triggered_date)
                : null
            }
            retired_date={
              prediction.retired_date ? new Date(prediction.retired_date) : null
            }
            judged_date={
              prediction.judged_date ? new Date(prediction.judged_date) : null
            }
          />
        </div>
        <div className="mt-8 flex flex-col gap-10">
          <div className="flex justify-between">
            {userBet ? (
              <div>
                <p>YOUR BET</p>
                <p>{`BET ON ${formatDate(userBet.date).toUpperCase()}`}</p>
              </div>
            ) : (
              <div>
                <p>ADD YOUR BET</p>
                <p>{`WAGER ${differenceInDays(
                  new Date(prediction.due_date),
                  new Date()
                )}`}</p>
              </div>
            )}

            <Bet
              bets={prediction.bets}
              discord_id={payload.discordId}
              status={prediction.status}
              prediction_id={prediction.id}
            />
          </div>
          {userBet && (
            <div className="flex justify-between">
              <div>
                <p>POTENTIAL POINTS</p>
                <p>GIVEN DUE DATE OF</p>
                <p>{formatDate(prediction.due_date).toUpperCase()}</p>
              </div>
              <div className="flex h-12">
                <PillDisplay
                  text={`+/- ${Math.min(
                    Math.floor(userBet.wager * payoutRatio),
                    1
                  )}`}
                  color={"bg-silver-chalice-grey"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h3>BETS</h3>
      </div>
      <div className="mt-4 flex flex-col gap-8 md:flex-row">
        <Card title="Endorsements" className="grow basis-4">
          {endorsements.length > 0 ? (
            <List items={endorseArray} headerElement={listHeader} />
          ) : (
            "No Endorsements were found!"
          )}
        </Card>
        <Card title="Undorsements" className="grow basis-4">
          {undorsements.length > 0 ? (
            <List items={undorseArray} headerElement={listHeader} />
          ) : (
            "No Endorsements were found!"
          )}
        </Card>
      </div>
    </>
  );
}
