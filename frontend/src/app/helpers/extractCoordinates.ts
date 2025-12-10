export function extractCoordinates(point: string): string {
 if (!point) return '';
 // Exemple : "SRID=4326;POINT (7.2454 43.6940)"
 const match = point.match(/\(([^)]+)\)/);
 return match ? match[1] : point;
}