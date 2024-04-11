import { ReactNode } from "react";

const Subtitle = ({ children }: { children: ReactNode }) => {
  return (
    <h2 className="mt-10 bg-opacity-50 bg-gradient-to-b from-black/70 to-black/90 bg-clip-text text-center text-3xl font-semibold text-transparent dark:text-white">
      {children}
    </h2>
  );
};

export default Subtitle;
