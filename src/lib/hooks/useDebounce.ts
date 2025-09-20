import { useCallback, useRef, useState } from "react";

export const useDebounce = (timeout: number = 600) => {
  const [value, setValue] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handleChange = useCallback(
    (value: string) => {
      setValue(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setValue(value);
      }, timeout);
    },
    [timeout],
  );

  return { handleChange, value };
};
