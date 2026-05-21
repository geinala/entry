import { format as dfFormat, parse as dfParse, parseISO, isValid } from "date-fns";
import { TSimulationUploadedRow } from "@/types/database";

export type TValidationErrorItem = {
  field_name?: string;
  row_number?: string | number;
  error_message?: string;
  invalid_value?: string;
};

export type TSimulationUploadedRowWithErrors = TSimulationUploadedRow & {
  normalizedErrorDetails: TValidationErrorItem[];
};

export type TEditableRowForm = {
  nosi: string;
  courier: string;
  customerName: string;
  address: string;
  city: string;
  weight: string;
  startDatetime: string;
  endDatetime: string;
};

export const toEditableForm = (row: TSimulationUploadedRowWithErrors): TEditableRowForm => ({
  nosi: row.nosi ?? "",
  courier: row.courier ?? "",
  customerName: row.customerName ?? "",
  address: row.address ?? "",
  city: row.city ?? "",
  weight: String(row.weight ?? ""),
  startDatetime:
    row.startDatetime instanceof Date ? row.startDatetime.toISOString() : String(row.startDatetime),
  endDatetime:
    row.endDatetime instanceof Date ? row.endDatetime.toISOString() : String(row.endDatetime),
});

export const formatDateTime = (value: Date | string | null | undefined) => {
  if (!value) return "-";

  // If it's already a Date instance, format directly in local time
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "-";
    return dfFormat(value, "yyyy-MM-dd HH:mm:ss");
  }

  const str = String(value).trim();

  // Try ISO parse first
  const iso = parseISO(str);
  if (isValid(iso)) return dfFormat(iso, "yyyy-MM-dd HH:mm:ss");

  // Try parsing as local 'yyyy-MM-dd HH:mm:ss'
  const parsed = dfParse(str, "yyyy-MM-dd HH:mm:ss", new Date());
  if (isValid(parsed)) return dfFormat(parsed, "yyyy-MM-dd HH:mm:ss");

  // Fallback to Date constructor (may interpret as UTC or local depending on format)
  const fallback = new Date(str);
  if (!Number.isNaN(fallback.getTime())) return dfFormat(fallback, "yyyy-MM-dd HH:mm:ss");

  return "-";
};
