import Image from "next/image";

type AvatarProps = {
  src: string;
  alt: string;
  size: number;
};

export const Avatar = (props: AvatarProps) => {
  return (
    <Image
      className="rounded-full"
      src={props.src}
      width={props.size}
      height={props.size}
      alt={props.alt}
    />
  );
};
