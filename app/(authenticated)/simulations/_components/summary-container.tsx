"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/app/_components/ui/card";
import { ItemMedia } from "@/app/_components/ui/item";
import React from "react";

interface SummaryContainerProps {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export default function SummaryContainer({
  title,
  description,
  icon,
  headerRight,
  children,
  className,
}: SummaryContainerProps) {
  return (
    <Card className={`gap-2 w-full ${className ?? ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            {icon ? (
              <ItemMedia variant={"icon"} className="bg-primary/10 border-0 h-full size-10">
                {icon}
              </ItemMedia>
            ) : null}
            <div>
              <CardTitle>{title}</CardTitle>
              {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
          </div>
          {headerRight ?? null}
        </div>
      </CardHeader>
      <CardContent className="w-full h-full">{children}</CardContent>
    </Card>
  );
}
