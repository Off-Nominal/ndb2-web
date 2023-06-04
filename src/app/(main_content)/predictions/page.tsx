import authAPI from "@/utils/auth";
import { SearchPredictions } from "./SearchPredictions";
import { redirect } from "next/navigation";
import ndb2API from "@/utils/ndb2";
import discordAPI from "@/utils/discord";
import { ShortDiscordGuildMember } from "@/types/discord";
import { APIBets } from "@/types/bets";
import { APISeasons } from "@/types/seasons";

const getPredictionSearchData = async () => {
  const payload = await authAPI.verify();

  if (!payload) {
    return redirect("/signin");
  }

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

export default async function Predictions() {
  const { discordId, bets, members, seasons } = await getPredictionSearchData();

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
