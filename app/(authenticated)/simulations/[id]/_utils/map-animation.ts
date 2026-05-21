export type MapCoordinate = {
  lat: number;
  lng: number;
};

const _interpolatePath = (coordinates: MapCoordinate[], progress: number) => {
  if (coordinates.length === 0) {
    return null;
  }

  if (coordinates.length === 1) {
    return coordinates[0];
  }

  if (progress <= 0) {
    return coordinates[0];
  }

  if (progress >= 1) {
    return coordinates[coordinates.length - 1];
  }

  const segmentDistances: number[] = [0];
  let totalDistance = 0;

  for (let index = 1; index < coordinates.length; index += 1) {
    const previous = coordinates[index - 1];
    const current = coordinates[index];
    const distance = Math.hypot(current.lng - previous.lng, current.lat - previous.lat);

    totalDistance += distance;
    segmentDistances.push(totalDistance);
  }

  const targetDistance = totalDistance * progress;

  for (let index = 1; index < segmentDistances.length; index += 1) {
    const startDistance = segmentDistances[index - 1];
    const endDistance = segmentDistances[index];

    if (targetDistance > endDistance && index < segmentDistances.length - 1) {
      continue;
    }

    const segmentLength = endDistance - startDistance;
    const segmentProgress =
      segmentLength === 0 ? 0 : (targetDistance - startDistance) / segmentLength;
    const start = coordinates[index - 1];
    const end = coordinates[index];

    return {
      lat: start.lat + (end.lat - start.lat) * segmentProgress,
      lng: start.lng + (end.lng - start.lng) * segmentProgress,
    };
  }

  return coordinates[coordinates.length - 1];
};
