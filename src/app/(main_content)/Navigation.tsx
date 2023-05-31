"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();

  const isSelected = (path: string): boolean => {
    return path === pathname;
  };

  const baseLiClasses =
    "relative after:absolute after:left-0 after:right-0 after:top-5 md:after:top-6 lg:after:top-7 after:mt-2 after:block after:h-1 after:w-full";
  const selectedLiClasses = baseLiClasses + " after:bg-moonstone-blue";
  const liClasses = baseLiClasses + " after:hover:bg-moss-green";
  const linkClasses = "text-md sm:text-base md:text-lg xl:text-xl";

  return (
    <nav>
      <ul className="flex justify-around gap-2 font-bold uppercase sm:justify-center sm:gap-8 xl:gap-16 ">
        <li className={isSelected("/") ? selectedLiClasses : liClasses}>
          <Link className={linkClasses} href="/">
            Leaders
          </Link>
        </li>
        <li
          className={isSelected("/predictions") ? selectedLiClasses : liClasses}
        >
          <Link className={linkClasses} href="/predictions">
            Predictions
          </Link>
        </li>
        <li className={isSelected("/signout") ? selectedLiClasses : liClasses}>
          <Link className={linkClasses} href="/signout" prefetch={false}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};
