"use client";

import Image from "next/image";

interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

export default function Logo({ width = 28, height = 28, ...props }: LogoProps) {
  return (
    <Image width={width} height={height} src="/images/logo.png" alt="Logo" {...props} unoptimized />
  );
}
