"use client";

import { Item, ItemContent, ItemMedia } from "@/app/_components/ui/item";
import { Skeleton } from "@/app/_components/ui/skeleton";

export const FileStatusSkeleton = () => {
  return (
    <Item variant={"outline"}>
      <ItemMedia>
        <Skeleton className="w-6 h-6" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-3/4 h-3" />
      </ItemContent>
    </Item>
  );
};
