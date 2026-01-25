import { Item, ItemContent, ItemHeader, ItemTitle } from "@/app/_components/ui/item";
import { Indicator } from "../../_components/indicator";
import { Paragraph } from "@/app/_components/typography";
import { ReactNode } from "react";

interface StatItemProps {
  title: string;
  value: string | ReactNode;
  indicatorColor?: string;
  showIndicator?: boolean;
  className?: string;
}

export default function StatItem({
  title,
  value,
  indicatorColor = "blue",
  showIndicator = true,
  className,
}: StatItemProps) {
  return (
    <Item variant={"muted"} className={`gap-2 ${className || ""}`}>
      <ItemHeader>
        <ItemTitle className="text-muted-foreground">{title}</ItemTitle>
      </ItemHeader>
      {typeof value === "string" ? (
        <ItemContent className="flex flex-row items-center gap-2">
          {showIndicator && <Indicator color={indicatorColor} />}
          <Paragraph className="not-first:mt-0 font-medium">{value}</Paragraph>
        </ItemContent>
      ) : (
        value
      )}
    </Item>
  );
}
