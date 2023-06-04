import { APIPredictions } from "@/types/predictions";
import { useEffect, useRef } from "react";

export const usePageIncrement = (
  predictions: APIPredictions.ShortEnhancedPrediction[],
  callback: () => void
) => {
  const targetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>();

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries, observer) => {
          if (entries[0].isIntersecting) {
            if (targetRef.current) {
              observer.unobserve(targetRef.current);
            }
            callback();
          }
        },
        {
          threshold: 1,
        }
      );
    }

    if (predictions.length < 10) {
      if (targetRef.current) {
        observerRef.current.unobserve(targetRef.current);
      }
      targetRef.current = null;
      return;
    }

    const newTarget = document.getElementById(
      `prediction-${predictions.at(-2)?.id}`
    );

    if (targetRef.current !== newTarget && newTarget) {
      targetRef.current = newTarget;
      observerRef.current.observe(targetRef.current);
    }
  }, [predictions, callback]);

  return () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (targetRef.current) {
      targetRef.current = null;
    }
  };
};
