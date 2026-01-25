import { Paragraph } from "@/app/_components/typography";
import { CloudUpload } from "lucide-react";

export default function CSVInput() {
  return (
    <>
      <input type="file" id="csv-input" accept=".csv" hidden />
      <label
        htmlFor="csv-input"
        className="flex items-center border rounded-md flex-col justify-center text-center px-5 py-7 border-dashed cursor-pointer hover:bg-gray-50 bg-muted"
      >
        <CloudUpload className="text-muted-foreground w-7 h-7" />
        <Paragraph className="leading-5">
          <span className="text-primary font-semibold">Click to upload</span> or drag and drop CSV
          file {"(max 5MB)"}
        </Paragraph>
      </label>
    </>
  );
}
