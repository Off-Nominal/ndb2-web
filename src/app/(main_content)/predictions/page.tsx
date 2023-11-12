import authAPI, { AppJWTPayload } from "@/utils/auth";
import { SearchPredictions } from "./SearchPredictions";
import { redirect } from "next/navigation";
import ndb2API from "@/utils/ndb2";
import discordAPI from "@/utils/discord";
import { ShortDiscordGuildMember } from "@/types/discord";
import { APIBets } from "@/types/bets";
import { APISeasons } from "@/types/seasons";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { getURLSearchParams } from "@/utils/helpers";
import { PageProps } from "@/types/base";

const title = "Nostradambot2 - Predictions";
const description =
  "A fun predictions betting game for the Off-Nominal Discord.";

export const metadata: Metadata = {
  title: "Predictions",
  openGraph: {
    title,
    description,
    url: "https://ndb2.offnom.com/predictions",
    siteName: title,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
    site: "@offnom",
    creator: "@JakeOnOrbit",
  },
};

const getPredictionSearchData = async (payload: AppJWTPayload) => {
  const data: {
    discordId: string;
    bets: APIBets.UserBet[];
    members: ShortDiscordGuildMember[];
    seasons: APISeasons.EnhancedSeason[];
  } = { discordId: payload.discordId, bets: [], members: [], seasons: [] };
  const guildMemberManager = new discordAPI.GuildMemberManager();

  const promises = Promise.all([
    guildMemberManager.initialize().catch((err) => {
      console.error(err);
      throw new Error("Unable to initialize Member Manager.");
    }),
    ndb2API.getUserBetsByDiscordId(payload.discordId).catch((err) => {
      console.error(err);
      throw new Error("Unable to fetch user's bets");
    }),
    ndb2API.getSeasons().catch((err) => {
      console.error(err);
      throw new Error("Unable to fetch seasons");
    }),
  ]);

  return promises
    .then((responses) => {
      data.bets = responses[1].data;
      const members = guildMemberManager.getMembers();
      data.members = Object.values(members);
      data.seasons = responses[2].data;
      return data;
    })
    .catch((err) => {
      throw err;
    });
};

export type PredictionsProps = {} & PageProps;

export default async function Predictions(props: PredictionsProps) {
  const token = cookies().get("token")?.value || "";
  const payload = await authAPI.verify(token);

  // user is not signed in, redirect to login
  if (!payload) {
    const queryString = getURLSearchParams(props.searchParams).toString();
    return redirect(
      "/signin?returnTo=" + encodeURIComponent("/predictions" + queryString)
    );
  }

  const { discordId, bets, members, seasons } = await getPredictionSearchData(
    payload
  );

  return (
    <>
      <SearchPredictions
        discordId={discordId}
        bets={bets}
        members={members}
        seasons={seasons}
      />
    </>
  );
}
