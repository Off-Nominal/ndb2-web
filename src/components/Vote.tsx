export const Vote = () => {
  return (
    <div className="relative w-24 h-12 overflow-hidden border rounded-full border-jet-grey bg-button-gray">
      {/* Triangle Up */}
      <div className="absolute hover:before:border-b-[19px] hover:before:border-b-solid hover:before:border-b-black translate-x-[60%] translate-y-[60%] border-x-[10px] border-b-[20px] border-solid border-x-transparent border-b-black  before:translate-x-[-50%] before:translate-y-[5%] before:border-x-[9px] before:border-b-[19px] before:border-solid before:absolute before:border-x-transparent before:border-b-white"></div>
      {/* Line */}
      <div className="absolute bottom-0 w-px h-12 bg-line-grey left-1/2"></div>
      {/* Triangle Down */}
      <div className="absolute hover:before:border-t-[19px] hover:before:border-t-solid hover:before:border-t-black translate-x-[300%] translate-y-[60%] border-x-[10px] border-t-[20px] border-solid border-x-transparent border-t-black  before:translate-x-[-50%] before:translate-y-[-105%] before:border-x-[9px] before:border-t-[19px] before:border-solid before:absolute before:border-x-transparent before:border-t-white"></div>
    </div>
  );
};
