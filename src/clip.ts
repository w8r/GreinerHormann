import Polygon from './polygon';

type Point = [number, number] | { x: number; y: number };
type PointArray = Point[];

/**
 * Clip driver
 * @param  {PointArray} polygonA
 * @param  {PointArray} polygonB
 * @param  {boolean}    sourceForwards
 * @param  {boolean}    clipForwards
 * @return {PointArray[] | null}
 */
export default function clip(
  polygonA: PointArray,
  polygonB: PointArray,
  eA: boolean,
  eB: boolean
): PointArray[] | null {
  const source = new Polygon(polygonA);
  const clipPoly = new Polygon(polygonB);
  return source.clip(clipPoly, eA, eB);
}
