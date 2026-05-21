"use client";

import { Button } from "@/app/_components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

const DownloadTemplateButton = () => {
  return (
    <Link href={"/template.xlsx"} download={"Simulation Template Input Data.xlsx"}>
      <Button variant={"outline"} type="button" size="sm" className="bg-transparent">
        <Download className="w-4 h-4 mr-2" />
        Download Template
      </Button>
    </Link>
  );
};

export default DownloadTemplateButton;
