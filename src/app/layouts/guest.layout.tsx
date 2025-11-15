import type { FC, PropsWithChildren } from "react";

export const GuestLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex h-screen items-center justify-center">{children}</div>;
};
