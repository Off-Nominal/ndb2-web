import Image from "next/image";

type AvatarProps = {
  src: string;
  alt: string;
  size: number;
  className?: string;
};

export const Avatar = (props: AvatarProps) => {
  const classes = props.className || "";
  return (
    <Image
      className={["rounded-full", classes].join(" ")}
      src={props.src}
      width={props.size}
      height={props.size}
      alt={props.alt}
    />
  );
};
