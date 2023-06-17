import { Avatar } from "@/components/Avatar";

type BetListItemProps = {
  date: string;
  avatarUrl: string;
  name: string;
  value: number | string;
};

const defaultAvatarUrl = "https://cdn.discordapp.com/embed/avatars/0.png";

export const BetListItem = (props: BetListItemProps) => {
  return (
    <div className="flex gap-x-4 gap-y-1">
      <div className="mt-1 basis-9">
        <Avatar
          src={props.avatarUrl || defaultAvatarUrl}
          alt={`Avatar photo for user ${props.name}`}
          size={36}
        />
      </div>
      <div className="flex grow flex-col lg:flex-row">
        <div className="basis-full lg:grow lg:basis-1/2">
          <span>{props.name}</span>
        </div>
        <div className="flex basis-full lg:mt-0.5 lg:basis-24 lg:justify-end">
          <span className="text-xs uppercase text-slate-500 dark:text-slate-400">
            {props.date}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 basis-10 justify-end lg:order-3">
        <span>{props.value.toLocaleString("en-US")}</span>
      </div>
    </div>
  );
};
