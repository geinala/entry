"use client";

import { useEffect } from "react";
import { useSidebar } from "../_components/ui/sidebar";

interface Params {
  ref: React.RefObject<HTMLElement | null>;
}

export const useCloseSidebarOnFocusOutside = ({ ref }: Params) => {
  const { setOpen } = useSidebar();

  useEffect(() => {
    if (!ref.current) return;

    const handleFocusOut = () => {
      setOpen(false);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("focus", handleFocusOut);

      return () => {
        element.removeEventListener("focus", handleFocusOut);
      };
    }
  }, [setOpen, ref]);
};
