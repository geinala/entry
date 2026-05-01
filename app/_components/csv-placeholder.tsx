"use client";

import Image from "next/image";
import { Paragraph } from "./typography";

interface CSVPlaceholderProps {
  fileName: string;
}

export const CSVPlaceholder = ({ fileName }: CSVPlaceholderProps) => {
  return (
    <div>
      <Image
        src={"/images/csv.webp"}
        alt="CSV Placeholder"
        width={32}
        height={32}
        className="mx-auto mb-2"
      />
      <Paragraph className="text-center">{fileName}</Paragraph>
    </div>
  );
};
