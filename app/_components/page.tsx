"use client";

import { PropsWithChildren } from "react";
import { Paragraph, Title } from "./typography";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
}

export default function Page({
  headerAction,
  title,
  description,
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4" {...props}>
      {
        <header className="flex justify-between items-center mb-2">
          <div>
            {title && <Title level={2}>{title}</Title>}
            {description && <Paragraph>{description}</Paragraph>}
          </div>
          {headerAction && headerAction}
        </header>
      }
      {children}
    </div>
  );
}
