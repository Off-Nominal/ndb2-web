import { LoadingDots } from "@/components/LoadingDots";

export default function Loading() {
  return (
    <div className="flex h-screen w-full place-content-center">
      <div className="w-32 ">
        <LoadingDots />
      </div>
    </div>
  );
}
