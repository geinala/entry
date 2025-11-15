import { useRef } from "react";

export function useDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Args) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
