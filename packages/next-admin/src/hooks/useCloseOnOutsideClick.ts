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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useClickOutside;
