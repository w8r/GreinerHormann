import boolean from './clip';

type Point = [number, number] | { x: number; y: number };
type PointArray = Point[];

/**
 * @param  {PointArray} polygonA
 * @param  {PointArray} polygonB
 * @return {PointArray[] | null}
 */
export function union(polygonA: PointArray, polygonB: PointArray): PointArray[] | null {
  return boolean(polygonA, polygonB, false, false);
}

/**
 * @param  {PointArray} polygonA
 * @param  {PointArray} polygonB
 * @return {PointArray[] | null}
 */
export function intersection(polygonA: PointArray, polygonB: PointArray): PointArray[] | null {
  return boolean(polygonA, polygonB, true, true);
}

/**
 * @param  {PointArray} polygonA
 * @param  {PointArray} polygonB
 * @return {PointArray[] | null}
 */
export function diff(polygonA: PointArray, polygonB: PointArray): PointArray[] | null {
  return boolean(polygonA, polygonB, false, true);
}

export const clip = boolean;
