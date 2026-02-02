import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "./_components/ui/sonner";
import { validateEnv } from "@/common/config/environtment";
import { QueryProvider } from "@/lib/tanstack";
import "maplibre-gl/dist/maplibre-gl.css";
import { SidebarProvider } from "./_components/ui/sidebar";

validateEnv();

export const metadata: Metadata = {
  title: "Routify",
  description:
    "Routify is a web application that allows users to create, simulate, and analyze various routing algorithms in a visual and interactive way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <ClerkProvider>
        <html lang="en">
          <body className={`antialiased`}>
            <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
            <Toaster position="top-center" />
          </body>
        </html>
      </ClerkProvider>
    </QueryProvider>
  );
}
