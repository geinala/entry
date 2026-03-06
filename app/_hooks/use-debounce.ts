"use client";

import { useRef, useCallback, useEffect } from "react";

export const useDebounce = <T extends (...args: never[]) => void>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const funcRef = useRef(func);

  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  return useCallback(
    (...args: Parameters<T>): void => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        funcRef.current(...args);
      }, wait);
    },
    [wait],
  );
};
