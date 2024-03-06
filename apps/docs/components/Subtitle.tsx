import { ReactNode } from "react";

const Subtitle = ({ children }: { children: ReactNode }) => {
  return (
    <h2 className="text-3xl dark:text-white font-semibold text-center bg-clip-text text-transparent bg-gradient-to-b from-black/70 to-black/90 bg-opacity-50 mt-10">
      {children}
    </h2>
  );
};

export default Subtitle;
