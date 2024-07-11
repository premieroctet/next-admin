import { RefObject, useEffect, useRef } from "react";

const useClickOutside = <E extends HTMLElement = HTMLElement>(
  callback: () => void
) => {
  const ref: RefObject<E> = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useClickOutside;
