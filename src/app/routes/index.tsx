import { Button } from "@/shared/ui/button";
import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
      <h1>Ini Nanti Landing Page</h1>
      <Button
        onClick={() => {
          throw new Error("Test Error");
        }}
      >
        Error
      </Button>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
});
