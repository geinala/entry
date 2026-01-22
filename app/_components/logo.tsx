"use client";

import Image from "next/image";

interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

export default function Logo({ width = 50, height = 50, ...props }: LogoProps) {
  return <Image width={width} height={height} src="/logo.png" alt="Logo" {...props} />;
}
