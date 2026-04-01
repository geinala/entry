type TCoordinate = {
  lat: number;
  lng: number;
};

/**
 * Pure function to decode polyline string to coordinates
 * @param encoded - Encoded polyline string
 * @param precision - Precision level (default: 5)
 * @returns Array of coordinates
 */
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
