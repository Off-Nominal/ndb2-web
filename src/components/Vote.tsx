export const Vote = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      className="relative w-40 h-20"
    >
      <rect
        x="0"
        y="0"
        width="150"
        height="60"
        rx="30"
        ry="30"
        fill="#b2afa1"
        stroke="black"
      />
      <line x1="75" y1="0" x2="75" y2="60" stroke="#a0a0a0" strokeWidth="2" />
      <polygon
        points="110,10 130,50 90,50"
        fill="white"
        stroke="black"
        strokeWidth="1"
        className="hover:fill-moss-green"
      />
      <polygon
        points="40,50 20,10 60,10"
        fill="white"
        stroke="black"
        strokeWidth="1"
        className="hover:fill-moss-green"
      />
    </svg>
  );
};
