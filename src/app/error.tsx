"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const defaultError =
    "Something went wrong! We could not process this request.";

  const errorMessage = error.message || defaultError;
  return (
    <section className="grid h-full place-content-center">
      <Card
        title="Something went wrong!"
        className="m-4 h-min max-w-xl shadow-md"
      >
        <div className="p-8">
          <p className="my-8">{errorMessage}</p>
          <div className="mt-16 flex justify-center">
            <Button onClick={() => reset()} label="Try again" />
          </div>
        </div>
      </Card>
    </section>
  );
}
