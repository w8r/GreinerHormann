import Polygon from './polygon';

type LatLng = [number, number];

/**
 * Clip driver
 * @param  {any} polygonA - Leaflet polygon
 * @param  {any} polygonB - Leaflet polygon
 * @param  {boolean} sourceForwards
 * @param  {boolean} clipForwards
 * @return {LatLng[] | LatLng[][] | null}
 */
export default function clip(
  polygonA: any,
  polygonB: any,
  sourceForwards: boolean,
  clipForwards: boolean
): LatLng[] | LatLng[][] | null {
  let source: [number, number][] = [];
  let clipPoly: [number, number][] = [];

  let latlngs = polygonA['_latlngs'][0];
  for (let i = 0, len = latlngs.length; i < len; i++) {
    source.push([latlngs[i]['lng'], latlngs[i]['lat']]);
  }
  latlngs = polygonB['_latlngs'][0];
  for (let i = 0, len = latlngs.length; i < len; i++) {
    clipPoly.push([latlngs[i]['lng'], latlngs[i]['lat']]);
  }

  const sourcePoly = new Polygon(source);
  const clipPolyObj = new Polygon(clipPoly);

  const result = sourcePoly.clip(clipPolyObj, sourceForwards, clipForwards);
  if (result && result.length > 0) {
    const converted: LatLng[][] = [];
    for (let i = 0, len = result.length; i < len; i++) {
      const latLngs = toLatLngs(result[i] as [number, number][]);
      if (latLngs) {
        converted.push(latLngs);
      }
    }

    if (converted.length > 0) {
      if (converted.length === 1) return converted[0];
      else return converted;
    } else return null;
  } else return null;
}

function toLatLngs(poly: [number, number][]): LatLng[] | null {
  let result = poly;

  if (result) {
    if (
      result[0][0] === result[result.length - 1][0] &&
      result[0][1] === result[result.length - 1][1]
    ) {
      result = result.slice(0, result.length - 1);
    }

    const converted: LatLng[] = [];
    for (let i = 0, len = result.length; i < len; i++) {
      converted.push([result[i][1], result[i][0]]);
    }
    return converted;
  } else {
    return null;
  }
}
