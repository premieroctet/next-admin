import { useEffect, useRef } from "react";

const useCloseOnOutsideClick = <E extends HTMLElement = HTMLElement>(
  close: () => void
) => {
  const ref: React.RefObject<E> = useRef(null);

  useEffect(() => {
    const onWindowClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
    };

    window.addEventListener("click", onWindowClick);
    return () => {
      window.removeEventListener("click", onWindowClick);
    };
  }, [close]);

  return ref;
};

export default useCloseOnOutsideClick;
