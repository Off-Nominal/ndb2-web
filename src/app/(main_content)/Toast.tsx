"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { ToastContext, ToastItemControlProps } from "../contexts/toast";

type ToastItemProps = Omit<ToastItemControlProps, "id">;

const ToastItem = (props: ToastItemProps) => {
  const { startFade, close } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [fadingIn, setFadingIn] = useState(true);

  useEffect(() => {
    if (startFade && ref.current !== null) {
      ref.current.addEventListener("animationend", () => {
        console.log("animationend");

        close();
      });
    }
  }, [startFade, close, fadingIn]);

  const colors = {
    success: "bg-moss-green",
    error: "bg-deep-chestnut-red",
    warning: "bg-california-yellow",
  };

  const fadeOutClass = startFade ? "opacity-0 height-0 animate-fade-out" : "";

  const fadeInClass = fadingIn ? "animate-fade-in" : "";

  return (
    <div
      ref={ref}
      onAnimationEnd={(event) => {
        setFadingIn(false);
      }}
      className={[
        "max-w-90 relative flex w-[350px] justify-between rounded-lg px-6 py-3",
        fadeInClass,
        fadeOutClass,
        colors[props.type],
      ].join(" ")}
      onClick={props.close}
    >
      <p>{props.message}</p>
      <div
        aria-label="Clear message"
        className="after:clip-x relative left-2  h-[24px] w-[24px] scale-75 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:scale-75 after:bg-slate-400 hover:bg-slate-300 after:hover:bg-slate-500"
      ></div>
    </div>
  );
};

export const Toast = () => {
  const { items } = useContext(ToastContext);

  return (
    <div className="fixed left-1/2 right-1/2 top-8 flex -translate-x-1/2 flex-col items-center gap-4">
      {items?.map((item) => (
        <ToastItem
          fadeOut={item.fadeOut}
          close={item.close}
          startFade={item.startFade}
          key={item.id}
          message={item.message}
          type={item.type}
        />
      ))}
    </div>
  );
};
