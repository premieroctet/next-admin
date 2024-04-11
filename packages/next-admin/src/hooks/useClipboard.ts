import { useCallback, useState } from "react";

type UseClipboardOptions = {
  duration?: number;
};

export const useClipboard = ({ duration = 3000 }: UseClipboardOptions = {}) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (value: string) => {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
    },
    [duration]
  );

  return { copied, copy };
};
