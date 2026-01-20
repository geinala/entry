"use client";

import Image from "next/image";

interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

export default function Logo({ width = 35, height = 35, ...props }: LogoProps) {
  return <Image width={width} height={height} src="/logo-new.png" alt="Logo" {...props} />;
}
