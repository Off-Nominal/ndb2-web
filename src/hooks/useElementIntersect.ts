import { useEffect, useRef } from "react";

export const useElementIntersect = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>();

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callback();
          }
        },
        {
          threshold: 1,
        }
      );
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);

  useEffect(() => {
    if (!ref.current || !observerRef.current) return;
    observerRef.current?.observe(ref.current);
  }, [callback, ref]);

  return ref;
};
