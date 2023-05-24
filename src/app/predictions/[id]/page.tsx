import { AuthClient } from "../../../utils/auth";
import { redirect } from "next/navigation";
import { Navigation } from "../../components/Navigation";
import { Ndb2Client } from "../../../utils/ndb2";
import { Card } from "@/components/Card";
import React from "react";

import { Vote } from "../../../components/Vote";

// SERVER SIDE DATA FETCHING
async function getPredictionInfo(): Promise<any> {
  const ndb2Client = new Ndb2Client();

  const headers: RequestInit["headers"] = { cache: "no-store" };

  try {
    const predictionInfo = await ndb2Client.getPredictionInfoById(1, headers);
    return {
      data: predictionInfo.data,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch prediction data");
  }
}

export default async function Predictions() {
  const authClient = new AuthClient();
  const payload = await authClient.verify();

  if (!payload) {
    return redirect("/signin");
  }

  const { data } = await getPredictionInfo();

  console.log(data);
  for (const bet of data.bets) {
    console.log(bet);
  }

  const endorsement = data.bets.filter((bet: { endorsed: boolean; }) => bet.endorsed === true)
  const undorsement = data.bets.filter((bet: { endorsed: boolean; }) => bet.endorsed === false)

  return (
    <div className="flex h-full w-full flex-col content-center p-8 align-middle">
      <nav className="mb-8 mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="h-min text-center text-3xl sm:text-4xl md:text-5xl">
          NOSTRADAMBOT<span className={"text-moonstone-blue"}>2</span>
        </h1>
        <Navigation />
      </nav>
      <main>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div>
              Prediction # {data.id}
              <br />
              by (Discord User) {data.predictor.discord_id}
              <br />
            </div>
            <div>STATUS: {data.status}</div>
          </div>
          <div>
            <br />
            TEXT: {data.text}
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <br />
            CREATED: {data.created_date}
            <br />
            DUE: {data.due_date}
            <br />
            <br />
          </div>
          <div>
            <Vote />
          </div>
        </div>
        BETS
        <div className="flex justify-evenly">
          <br />
          <br />
          <Card title="Endorsements">
            <table>
              <thead>
                <tr>
                  <th>Better </th>
                  <th>Date </th>
                  <th>Wager </th>
                  <th>Type of Bet </th>
                </tr>
              </thead>
              <tbody>
                {endorsement.length > 0 ? endorsement.map((bet: any) => {
                  return (
                    <tr key={bet.better.discord_id}>
                      <td>{bet.better.discord_id}</td>
                      <td>{bet.date}</td>
                      <td>{bet.wager}</td>
                      <td>{bet.endorsed ? "Endorsed" : "Undorsed"}</td>
                    </tr>
                  );
                }): "Nothing to see here"}
              </tbody>
            </table>
          </Card>
          <Card title="Undorsements">{undorsement.length > 0 ? undorsement.map((bet: any) => {
                  return (
                    <tr key={bet.better.discord_id}>
                      <td>{bet.better.discord_id}</td>
                      <td>{bet.date}</td>
                      <td>{bet.wager}</td>
                      <td>{bet.endorsed ? "Endorsed" : "Undorsed"}</td>
                    </tr>
                  );
                }): "Nothing to see here"}</Card>
        </div>
        <br />
        <br />
      </main>
    </div>
  );
}
