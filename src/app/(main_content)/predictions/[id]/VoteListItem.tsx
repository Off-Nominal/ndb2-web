import { Avatar } from "@/components/Avatar";

export type VoteListItemProps = {
  name: string;
  avatarUrl: string;
};

export const VoteListItem = (props: VoteListItemProps) => {
  return (
    <div className="flex gap-x-4 gap-y-1">
      <div className="mt-1 basis-9">
        <Avatar
          src={props.avatarUrl}
          alt={`Avatar photo for user ${props.name}`}
          size={36}
        />
      </div>
      <div className="flex grow">
        <span>{props.name}</span>
      </div>
    </div>
  );
};
