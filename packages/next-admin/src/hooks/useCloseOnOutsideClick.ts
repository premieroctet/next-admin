import { useEffect } from "react";

function useCloseOnOutsideClick(
  ref: React.RefObject<HTMLElement>,
  close: () => void
) {
  function onWindowClick(event: MouseEvent) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      close();
    }
  }
  useEffect(
    () => {
      window.addEventListener("click", onWindowClick);
      return () => {
        window.removeEventListener("click", onWindowClick);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}

export default useCloseOnOutsideClick;
