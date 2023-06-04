import { redirect } from "next/navigation";

import React from "react";

import { Card } from "@/components/Card";
import { Timeline } from "@/components/Timeline";
import { PillDisplay } from "@/components/PillDisplay";
import { Bet } from "@/components/Bet";

import authAPI from "@/utils/auth";
import ndb2API from "@/utils/ndb2";
import discordAPI from "@/utils/discord";
import { ShortDiscordGuildMember } from "@/types/discord";
import { format } from "date-fns";
import Image from "next/image";
import { APIPredictions, PredictionLifeCycle } from "@/types/predictions";

type ListBet = Omit<APIPredictions.Bet, "better"> & {
  name: string;
  avatarUrl: string;
};

const formatDate = (date: string) => {
  return format(new Date(date), "LLL do, yyyy");
};

const generateBet = (
  bet: APIPredictions.Bet,
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

// SERVER SIDE DATA FETCHING
async function fetchPrediction(id: number): Promise<{
  prediction: APIPredictions.EnhancedPrediction;
  predictor: ShortDiscordGuildMember;
  endorsements: ListBet[];
  undorsements: ListBet[];
}> {
  const headers: RequestInit["headers"] = { cache: "no-store" };
  const guildMemberManager = new discordAPI.GuildMemberManager();

  const promises: [Promise<void>, Promise<APIPredictions.GetPredictionById>] = [
    guildMemberManager.initialize(),
    ndb2API.getPredictionById(id, headers),
  ];

  let prediction: APIPredictions.EnhancedPrediction;

  try {
    const results = await Promise.all(promises);
    prediction = results[1].data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch prediction data");
  }

  try {
    const userLookup = await guildMemberManager.buildUserLookup(
      prediction.bets.map((bet) => bet.better.discord_id)
    );
    const predictor = userLookup[prediction.predictor.discord_id];
    const endorsements = prediction.bets
      .filter((bet) => bet.endorsed)
      .map((bet) => generateBet(bet, userLookup[bet.better.discord_id]));
    const undorsements = prediction.bets
      .filter((bet) => !bet.endorsed)
      .map((bet) => generateBet(bet, userLookup[bet.better.discord_id]));

    return { prediction, predictor, endorsements, undorsements };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch user infor");
  }
}

export default async function Predictions({ params }: any) {
  const payload = await authAPI.verify();

  if (!payload) {
    return redirect("/signin");
  }

  const { prediction, predictor, endorsements, undorsements } =
    await fetchPrediction(params.id);

  const statusColor = {
    [PredictionLifeCycle.RETIRED]: "bg-button-gray",
    [PredictionLifeCycle.SUCCESSFUL]: "bg-moss-green",
    [PredictionLifeCycle.FAILED]: "bg-deep-chestnut-red",
    [PredictionLifeCycle.OPEN]: "bg-moonstone-blue",
    [PredictionLifeCycle.CLOSED]: "bg-button-gray",
  };

  return (
    <div className="flex flex-col content-center w-full h-full p-8 align-middle">
      <main className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <div>
              Prediction # {prediction.id}
              <br />
              by {predictor.name}
              <br />
            </div>
            <PillDisplay
              text={prediction.status.toUpperCase()}
              color={statusColor[prediction.status]}
            />
          </div>
          <div className="justify-center w-full h-full p-2 text-left rounded-lg bg-silver-chalice-grey">
            <p>{prediction.text}</p>
          </div>
        </div>
        <div className="flex justify-evenly">
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
                prediction.retired_date
                  ? new Date(prediction.retired_date)
                  : null
              }
              judged_date={
                prediction.judged_date ? new Date(prediction.judged_date) : null
              }
            />
          </div>
          <div>
            <div>
              <div>
                <p>YOUR BET</p>
                <p>BET ON SOME DAY</p>
              </div>
              <div>
                <Bet bets={prediction.bets} />
              </div>
            </div>
            <div>
              <div>
                <p>POTENTIAL POINTS</p>
                <p>GIVEN DUE DATE OF SOME DAY</p>
              </div>
              <div>
                <PillDisplay text={"+/- 278"} color={"bg-button-gray"} />
              </div>
            </div>
          </div>
        </div>
        <div>BETS</div>
        <div className="flex justify-evenly">
          <Card title="Endorsements">
            {endorsements.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Better </th>
                    <th>Date </th>
                    <th>Wager </th>
                  </tr>
                </thead>
                <tbody>
                  {endorsements.map((bet) => {
                    return (
                      <tr key={bet.id}>
                        <td>
                          <Image
                            src={bet.avatarUrl}
                            alt={bet.name}
                            width={25}
                            height={25}
                          />
                        </td>
                        <td>{bet.name}</td>
                        <td>{formatDate(bet.date)}</td>
                        <td>{bet.wager}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              "Nothing to see here"
            )}
          </Card>
          <Card title="Undorsements">
            {undorsements.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Better </th>
                    <th>Date </th>
                    <th>Wager </th>
                  </tr>
                </thead>
                <tbody>
                  {undorsements.map((bet) => {
                    return (
                      <tr key={bet.id}>
                        <td>
                          <Image
                            src={bet.avatarUrl}
                            alt={bet.name}
                            width={25}
                            height={25}
                          />
                        </td>
                        <td>{bet.name}</td>
                        <td>{formatDate(bet.date)}</td>
                        <td>{bet.wager}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              "Nothing to see here"
            )}
          </Card>
        </div>
        <br />
        <br />
      </main>
    </div>
  );
}
