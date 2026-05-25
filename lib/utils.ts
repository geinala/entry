import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as dateFnsFormat } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import env from "@/common/config/environtment";
import { TCoordinate } from "@/types/route";
import { TTrafficIncidentGeometry } from "@/types/database";

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

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

export function metersToKm(meters: number): number {
  return meters / 1000;
}

export function formatSeconds(
  totalSeconds: number,
  format: string[] = ["hours", "minutes", "seconds"],
): string {
  const isNegative = totalSeconds < 0;
  const safeTotalSeconds = Math.abs(Math.floor(totalSeconds));
  const hours = Math.floor(safeTotalSeconds / 3600);
  const minutes = Math.floor((safeTotalSeconds % 3600) / 60);
  const seconds = safeTotalSeconds % 60;

  const parts = format
    .map((unit) => {
      if (unit === "hours" && hours > 0) {
        return `${hours}h`;
      }

      if (unit === "minutes" && (minutes > 0 || hours > 0)) {
        return `${minutes}m`;
      }

      if (unit === "seconds" && (seconds > 0 || (hours === 0 && minutes === 0))) {
        return `${seconds}s`;
      }

      return null;
    })
    .filter((part): part is string => part !== null);

  const formatted = parts.length > 0 ? parts.join(" ") : "0s";

  return isNegative && formatted !== "0s" ? `-${formatted}` : formatted;
}

export const countCsvRows = async (file: File) => {
  const content = await file.text();

  // Remove BOM
  const normalizedContent = content.replace(/^\uFEFF/, "");

  const lines = normalizedContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // No data or only header
  if (lines.length <= 1) {
    return 0;
  }

  // Ignore header row
  return lines.length - 1;
};

export function snakeToText(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

export const decodePolyline = (encoded: string, precision = 5): TCoordinate[] => {
  const coordinates: TCoordinate[] = [];
  const factor = Math.pow(10, precision);

  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    coordinates.push({ lat: lat / factor, lng: lng / factor });
  }

  return coordinates;
};

export const getRouteCenter = (coordinates: TCoordinate[]): [number, number] | undefined => {
  if (coordinates.length === 0) {
    return undefined;
  }

  const bounds = coordinates.reduce(
    (accumulator, coordinate) => {
      return {
        minLat: Math.min(accumulator.minLat, coordinate.lat),
        maxLat: Math.max(accumulator.maxLat, coordinate.lat),
        minLng: Math.min(accumulator.minLng, coordinate.lng),
        maxLng: Math.max(accumulator.maxLng, coordinate.lng),
      };
    },
    {
      minLat: coordinates[0].lat,
      maxLat: coordinates[0].lat,
      minLng: coordinates[0].lng,
      maxLng: coordinates[0].lng,
    },
  );

  return [(bounds.minLng + bounds.maxLng) / 2, (bounds.minLat + bounds.maxLat) / 2];
};

export const geometryToCoordinates = (
  geometry?: TTrafficIncidentGeometry | null,
): TCoordinate[] => {
  if (!geometry || geometry.type !== "LineString") {
    return [];
  }

  return geometry.coordinates.map(([lng, lat]) => ({ lng, lat }));
};

export const getAutoZoom = (
  coordinates: {
    lat: number;
    lng: number;
  }[],
  fallbackZoom = 14.8,
) => {
  if (coordinates.length === 0) {
    return fallbackZoom;
  }

  const bounds = coordinates.reduce(
    (accumulator, coordinate) => ({
      minLat: Math.min(accumulator.minLat, coordinate.lat),
      maxLat: Math.max(accumulator.maxLat, coordinate.lat),
      minLng: Math.min(accumulator.minLng, coordinate.lng),
      maxLng: Math.max(accumulator.maxLng, coordinate.lng),
    }),
    {
      minLat: coordinates[0].lat,
      maxLat: coordinates[0].lat,
      minLng: coordinates[0].lng,
      maxLng: coordinates[0].lng,
    },
  );

  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.000001);
  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.000001);
  const span = Math.max(latSpan, lngSpan);

  if (span >= 0.12) return 11.8;
  if (span >= 0.08) return 12.3;
  if (span >= 0.05) return 12.8;
  if (span >= 0.03) return 13.4;
  if (span >= 0.02) return 14;
  if (span >= 0.01) return 14.4;

  return fallbackZoom;
};
