import { APIPredictions } from "@/types/predictions";
import { useEffect, useRef } from "react";

export const usePageIncrement = (
  predictions: APIPredictions.ShortEnhancedPrediction[],
  callback: () => void
) => {
  const targetRef = useRef<HTMLElement | null>(null);

  const handlePageIncrement: IntersectionObserverCallback = (
    entries,
    observer
  ) => {
    if (entries[0].isIntersecting) {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
      targetRef.current = null;
      callback();
    }
  };

  const observerRef = useRef(
    new IntersectionObserver(handlePageIncrement, { threshold: 1 })
  );

  useEffect(() => {
    if (predictions.length < 10) {
      if (targetRef.current) {
        observerRef.current.unobserve(targetRef.current);
      }
      targetRef.current = null;
      return;
    }

    targetRef.current = document.getElementById(
      `prediction-${predictions.at(-2)?.id}`
    );

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }
  }, [predictions]);

  return () => {
    observerRef.current.disconnect();
    if (targetRef.current) {
      targetRef.current = null;
    }
  };
};
