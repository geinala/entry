import { useEffect } from "react";
import { useSidebar } from "../_components/ui/sidebar";

interface Params {
  ref: React.RefObject<HTMLElement | null>;
}

export const useCloseSidebarOnFocusOutside = ({ ref }: Params) => {
  const { setOpen } = useSidebar();

  useEffect(() => {
    console.log("useCloseSidebarOnFocusOutside mounted");
    console.log("ref current:", ref.current);

    if (!ref.current) return;

    const handleFocusOut = () => {
      console.log("Focus moved outside, closing sidebar");
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
