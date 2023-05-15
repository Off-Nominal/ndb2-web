"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { AppError } from "@/utils/errors";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="grid h-full place-content-center">
      <Card title="Something went wrong!" className="h-min max-w-xl shadow-md">
        <p>We had trouble processing your request.</p>
        <div className="mt-8 flex justify-center">
          <Button onClick={() => reset()} label="Try again" />
        </div>
      </Card>
    </section>
  );
}
