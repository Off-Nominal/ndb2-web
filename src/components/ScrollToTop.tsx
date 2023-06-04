import { Button } from "@/components/Button";
import { useEffect, useState } from "react";

export type ScrollToTopProps = {
  text: string;
};

const useScrollPosition = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    if (scrollPosition > 500) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { isScrolled, scrollToTop };
};

export const ScrollToTop = (props: ScrollToTopProps) => {
  const { isScrolled, scrollToTop } = useScrollPosition();

  const showClass = isScrolled
    ? " visible opacity-100"
    : " invisible opacity-0";
  return (
    <div
      className={
        "duration-400 fixed bottom-4 right-4 transition-all ease-in-out" +
        showClass
      }
    >
      <Button
        className="shadow-md shadow-slate-500 dark:shadow-slate-700"
        onClick={scrollToTop}
      >
        {props.text}
      </Button>
    </div>
  );
};
