import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/shared/lib/utils";

interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  label?: string;
  labelPosition?: "center" | "start" | "end";
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  label,
  labelPosition = "center",
  ...props
}: SeparatorProps) {
  const isHorizontal = orientation === "horizontal";

  if (label && isHorizontal) {
    return (
      <div
        className={cn(
          "flex w-full items-center text-muted-foreground text-sm",
          {
            "justify-center": labelPosition === "center",
            "justify-start": labelPosition === "start",
            "justify-end": labelPosition === "end",
          },
          className,
        )}
        data-slot="separator-label-wrapper"
      >
        <SeparatorPrimitive.Root
          decorative={decorative}
          orientation="horizontal"
          className="bg-border h-px flex-1"
          {...props}
        />
        <span className="px-3 whitespace-nowrap">{label}</span>
        <SeparatorPrimitive.Root
          decorative={decorative}
          orientation="horizontal"
          className="bg-border h-px flex-1"
          {...props}
        />
      </div>
    );
  }

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn("bg-border shrink-0", isHorizontal ? "h-px w-full" : "w-px h-full", className)}
      {...props}
    />
  );
}

export { Separator };
