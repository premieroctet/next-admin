import { RefObject, useEffect, useRef } from "react";

const useClickOutside = <E extends HTMLElement = HTMLElement>(
  callback: () => void
) => {
  const ref = useRef<E>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    setTimeout(() => {
      /**
       * There is a weird behavior on Page Router where this triggers
       * just when a selector is opened. I suppose this is because the click event is not finished
       * dispatching when we click on a trigger, but this is strange that
       * this does not occur in App Router
       */
      document.addEventListener("click", handleClickOutside);
    });
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useClickOutside;
