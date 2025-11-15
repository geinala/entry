import type { HtmlHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  row?: boolean;
  isFullScreen?: boolean;
  children: ReactNode;
}

export const Centered = ({ children, row, isFullScreen, ...props }: Props) => {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-center",
        row ? "flex-row" : "flex-col",
        isFullScreen && "w-screen h-screen",
        props.className,
      )}
    >
      {children}
    </div>
  );
};
