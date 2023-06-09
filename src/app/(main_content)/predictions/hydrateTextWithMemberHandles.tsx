import { ShortDiscordGuildMember } from "@/types/discord";
import { ReactNode } from "react";
import reactStringReplace from "react-string-replace";

export const hydrateTextWithMemberHandles = (
  text: string,
  memberHandles: ShortDiscordGuildMember[]
): ReactNode[] => {
  const regex = new RegExp(/(<@[0-9]{17,}>)/g);

  return reactStringReplace(text, regex, (match, i) => {
    const matchId = match.slice(2, -1);
    const member = memberHandles.find((member) => member.discordId === matchId);
    console.log(member);
    if (!member) {
      return <span key={i}>{match}</span>;
    }
    return (
      <span
        key={i}
        className="bg-discord-mention-background bg-opacity-30 text-discord-mention-foreground hover:bg-opacity-100 hover:text-white"
      >
        @{member.name}
      </span>
    );
  }) as ReactNode[];
};
