import { Button } from "@/app/_components/ui/button";
import { Download } from "lucide-react";

const DownloadTemplateButton = () => {
  return (
    <Button variant={"outline"} size="sm" className="bg-transparent">
      <Download className="w-4 h-4 mr-2" />
      Download Template
    </Button>
  );
};

export default DownloadTemplateButton;
