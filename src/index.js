import boolean from './clip';

/**
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
 * @return {Array.<Array.<Number>>|Array.<Array.<Object>|Null}
 */
export function union (polygonA, polygonB) {
  return boolean(polygonA, polygonB, false, false);
}

/**
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
 * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
 */
export function intersection (polygonA, polygonB) {
  return boolean(polygonA, polygonB, true, true);
}

/**
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
 * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
 */
export function diff (polygonA, polygonB) {
  return boolean(polygonA, polygonB, false, true);
}

export const clip = boolean;
