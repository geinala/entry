import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles Management",
};

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
