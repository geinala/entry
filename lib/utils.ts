import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as dateFnsFormat } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import env from "@/common/config/environtment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IConvertUtcToLocalTimeParams {
  utcDateStr: string;
  format?: string;
}

export function convertUtcToLocalTime(params: IConvertUtcToLocalTimeParams) {
  const { utcDateStr, format } = params;

  const date = new Date(utcDateStr);

  const localDate = toZonedTime(date, env.NEXT_PUBLIC_NODE_TZ);

  return format ? dateFnsFormat(localDate, format) : localDate;
}
