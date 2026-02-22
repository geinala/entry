import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waitlist Management",
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
