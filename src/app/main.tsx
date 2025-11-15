import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "leaflet/dist/leaflet.css";
import { QueryClientProvider } from "./providers/query-client.provider";
import { init as SentryInit } from "@sentry/browser";
import { GlobalErrorListener } from "./error/ui/global-listener";
import { RouterProvider } from "./providers/router.provider";
import { sentryConfig } from "@/config/sentry";

SentryInit({
  dsn: sentryConfig.dsn,
  // TODO: Configure Sentry
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider>
      <GlobalErrorListener />
      <RouterProvider />
    </QueryClientProvider>
  </StrictMode>,
);
