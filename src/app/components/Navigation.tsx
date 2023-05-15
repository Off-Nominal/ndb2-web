"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();

  const isSelected = (path: string): boolean => {
    return path === pathname;
  };

  return (
    <ul className="flex justify-center gap-2 font-bold uppercase sm:gap-8 xl:gap-16 ">
      <li className={"pb-8"}>
        <Link
          className={
            "text-sm sm:text-base md:text-lg xl:text-xl" + isSelected("/")
              ? "before:-z-1 before:relative before:-bottom-[4px] before:left-0 before:top-auto before:block before:h-[6px] before:w-full before:bg-moss-green before:opacity-100"
              : ""
          }
          href="/"
        >
          Leaderboards
        </Link>
      </li>
      <li className={"pb-8 " + isSelected("/predictions") ? "" : ""}>
        <Link
          className="text-sm sm:text-base md:text-lg xl:text-xl"
          href="/predictions"
        >
          Predictions
        </Link>
      </li>
      <li className={"before:width-full before:bottom pb-8"}>
        {" "}
        <Link
          className="text-sm sm:text-base md:text-lg xl:text-xl"
          href="/signout"
        >
          Logout
        </Link>
      </li>
    </ul>
  );
};
