import { useEffect, useRef } from "react";

export const useClickOutside = (callback: () => any) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = () => {
      console.log("click");
      callback();
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, callback]);

  return ref;
};
