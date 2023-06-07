"use client";

import React, { createContext, useContext, useState } from "react";

export type AddToastProps = {
  message: string;
  type: "success" | "error" | "warning";
  closeable?: boolean;
};

type ToastContextValue = {
  items: ToastItemControlProps[];
  addToast: (item: AddToastProps) => void;
};

export const ToastContext = createContext<ToastContextValue>({
  items: [],
  addToast: () => {},
});

// Main Hook

export const useToast = () => {
  const { addToast } = useContext(ToastContext);

  return { addToast };
};

// Toast Provider

type ToastProviderProps = {
  children: React.ReactNode | React.ReactNode[];
};

export type ToastItemControlProps = AddToastProps & {
  id: string;
  fadeOut: () => void;
  startFade: boolean;
  close: () => void;
};

const generateId = () => Math.random().toString(36).substring(7);

export default function ToastProvider(props: ToastProviderProps) {
  const [items, setItems] = useState<ToastItemControlProps[]>([]);
  console.log(items);

  const unMountToast = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const transitionToastOut = (id: string) => {
    setItems((prev) => {
      const toastIndex = prev.findIndex((item) => item.id === id);

      if (toastIndex < 0) {
        return prev;
      }

      const newItems = [...prev];
      newItems[toastIndex] = { ...newItems[toastIndex], startFade: true };
      return newItems;
    });
  };

  const addToast = (newItem: AddToastProps) => {
    const id = generateId();

    const timer = setTimeout(() => {
      transitionToastOut(id);
    }, 5000);

    const item: ToastItemControlProps = {
      id,
      ...newItem,
      startFade: false,
      close: () => unMountToast(id),
      fadeOut: () => {
        clearTimeout(timer);
        transitionToastOut(id);
      },
    };

    setItems((prev) => [...prev, item]);
  };

  return (
    <ToastContext.Provider value={{ items, addToast }}>
      {props.children}
    </ToastContext.Provider>
  );
}
