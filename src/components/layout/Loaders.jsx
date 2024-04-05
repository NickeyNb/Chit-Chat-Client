export const LayoutLoader = ({ children }) => {
  return (
    <div className=" grid h-screen  grid-cols-12">
      <div className="col-span-4 hidden h-full  sm:block md:col-span-3">
        Loding First...
      </div>
      <div className="col-span-12 h-full sm:col-span-8 md:col-span-5 lg:col-span-6">
        Loding main
      </div>
      <div className="col-span-4 hidden h-full   md:col-span-4 md:block lg:col-span-3">
        Loading third
      </div>
    </div>
  );
};

export const TypingLoader = () => {
  return "Typing...";
};
