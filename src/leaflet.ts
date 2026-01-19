import boolean from './clip.leaflet';

type LatLng = [number, number];

/**
 * @api
 * @param  {any} polygonA - Leaflet polygon
 * @param  {any} polygonB - Leaflet polygon
 * @return {LatLng[] | LatLng[][] | null}
 */
export function union(polygonA: any, polygonB: any): LatLng[] | LatLng[][] | null {
  return clip(polygonA, polygonB, false, false);
}

/**
 * @api
 * @param  {any} polygonA - Leaflet polygon
 * @param  {any} polygonB - Leaflet polygon
 * @return {LatLng[] | LatLng[][] | null}
 */
export function intersection(polygonA: any, polygonB: any): LatLng[] | LatLng[][] | null {
  return clip(polygonA, polygonB, true, true);
}

/**
 * @api
 * @param  {any} polygonA - Leaflet polygon
 * @param  {any} polygonB - Leaflet polygon
 * @return {LatLng[] | LatLng[][] | null}
 */
export function diff(polygonA: any, polygonB: any): LatLng[] | LatLng[][] | null {
  return clip(polygonA, polygonB, false, true);
}

export const clip = boolean;
