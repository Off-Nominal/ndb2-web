"use client";
import { usePredictionSearch } from "./usePredictionSearch";

export const SearchPredictions = () => {
  const { predictions } = usePredictionSearch();

  return (
    <>
      <div>Search</div>
      <div>
        {predictions.map((p) => (
          <article key={p.id}>
            <h2>{p.predictor.discord_id}</h2>
            <p>{p.text}</p>
          </article>
        ))}
      </div>
    </>
  );
};
