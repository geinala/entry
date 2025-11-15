import { LoaderCircle } from "lucide-react";

export const Loading = () => {
  return (
    <div className="w-full flex justify-center items-center h-full">
      <LoaderCircle className="animate-spin text-primary w-9 h-9" />
    </div>
  );
};
