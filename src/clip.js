import Polygon from './polygon';

/**
 * Clip driver
 * @param  {Array.<Array.<Number>>} polygonA
 * @param  {Array.<Array.<Number>>} polygonB
 * @param  {Boolean}                sourceForwards
 * @param  {Boolean}                clipForwards
 * @return {Array.<Array.<Number>>}
 */
export default function (polygonA, polygonB, eA, eB) {
  const source = new Polygon(polygonA);
  const clip = new Polygon(polygonB);
  return source.clip(clip, eA, eB);
}
