import { TimelineItem } from "./TimelineItem";

export const Timeline = () => {
  const dates = [
    { label: "Created", date: "May 22nd, 2023", status: "complete", top: false, bottom: true },
    { label: "Due", date: "Jun 5th, 2023", status: "in_progress", top: true, bottom: true },
    { label: "Effective Close", date: "-", status: "not_started", top: true, bottom: true },
    { label: "Judgement", date: "-", status: "not_started", top: true, bottom: false },
  ];
  const circlePiece = dates.map((date, index) => {
    return (
      <TimelineItem dateObject={date} key={index} />
    )
  });
  return (
    <div className="grid grid-cols-3 gap-y-0">
     
    {circlePiece}
    </div>
  );
};
