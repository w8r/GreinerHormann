// Router

/**
 * Clip driver
 * @param  {L.Polygon} polygonA
 * @param  {L.Polygon} polygonB
 * @param  {Boolean} sourceForwards
 * @param  {Boolean} clipForwards
 * @return {Array.<L.LatLng>|null}
 */
function clip(polygonA, polygonB, sourceForwards, clipForwards) {
    var source = [],
        clip = [],
        result, i, len;

    for (i = 0, len = polygonA._latlngs.length; i < len; i++) {
        source.push([polygonA._latlngs[i].lng, polygonA._latlngs[i].lat]);
    }
    for (i = 0, len = polygonB._latlngs.length; i < len; i++) {
        clip.push([polygonB._latlngs[i].lng, polygonB._latlngs[i].lat]);
    }

    source = new Polygon(source),
    clip = new Polygon(clip);

    result = source.clip(clip, sourceForwards, clipForwards);
    if (result.length > 0) {
        for (var i = 0, len = result.length; i < len; i++) {
            result[i] = toLatLngs(result[i]);
        }

        if (result) {
            if (result.length === 1) {
                return result[0];
            } else {
                return result;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function toLatLngs(poly) {
    var result = poly.getPoints().slice(0, poly.vertices - 1);

    if (result) {
        for (var i = 0, len = result.length; i < len; i++) {
            result[i] = [result[i][1], result[i][0]];
        }

        return result;
    } else {
        return null;
    }
}
