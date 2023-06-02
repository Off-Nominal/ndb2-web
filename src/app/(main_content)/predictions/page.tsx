import authAPI from "@/utils/auth";
import { SearchPredictions } from "./SearchPredictions";
import { redirect } from "next/navigation";
import ndb2API from "@/utils/ndb2";
import { APIPredictions } from "@/types/predictions";
import discordAPI from "@/utils/discord";
import { ShortDiscordGuildMember } from "@/types/discord";

const getPredictionSearchData = async () => {
  const payload = await authAPI.verify();

  if (!payload) {
    return redirect("/signin");
  }

  const data: {
    discordId: string;
    bets: APIPredictions.Bet[];
    members: ShortDiscordGuildMember[];
  } = { discordId: payload.discordId, bets: [], members: [] };
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
  ]);

  return promises
    .then((responses) => {
      data.bets = responses[1].data;
      const members = guildMemberManager.getMembers();
      data.members = Object.values(members);
      return data;
    })
    .catch((err) => {
      throw err;
    });
};

export default async function Predictions() {
  const { discordId, bets, members } = await getPredictionSearchData();

  return (
    <>
      <SearchPredictions discordId={discordId} bets={bets} members={members} />
    </>
  );
}
