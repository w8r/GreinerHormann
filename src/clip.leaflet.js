"use strict";

var Polygon = require('./polygon');

function op(s, c) {
    if (s && c) {
        return 'intersection';
    } else if (!(s && c)) {
        return 'union';
    } else {
        return 'diff';
    }
}

/**
 * Clip driver
 * @api
 * @param  {L.Polygon} A
 * @param  {L.Polygon} B
 * @param  {Boolean} sourceForwards
 * @param  {Boolean} clipForwards
 * @return {Array.<L.LatLng>|null}
 */
module.exports = function leafletClip(A, B, sourceForwards, clipForwards) {
    console.group(op(sourceForwards, clipForwards));
    console.group('hulls');

    A['_latlngs'].push(new L.LatLng(A['_latlngs'][0].lat, A['_latlngs'][0].lng));
    B['_latlngs'].push(new L.LatLng(B['_latlngs'][0].lat, B['_latlngs'][0].lng));

    var poly1 = [],
        poly2 = [];

    var len = A['_latlngs'].length - 1;
    (A._holes || []).forEach(function(h) {
        h[0].h = h[0].s = true;
        h.push(new L.LatLng(h[0].lat, h[0].lng));
        h[h.length - 1].e = true;
        h.push(new L.LatLng(A['_latlngs'][len].lat, A['_latlngs'][len].lng))
    });

    len = B['_latlngs'].length - 1;
    (B._holes || []).forEach(function(h) {
        h[0].h = h[0].s = true;
        h.push(new L.LatLng(h[0].lat, h[0].lng));
        h[h.length - 1].e = true;
        h.push(new L.LatLng(B['_latlngs'][len].lat, B['_latlngs'][len].lng));
    });

    A['_latlngs'][A['_latlngs'].length - 1].e = true;
    B['_latlngs'][B['_latlngs'].length - 1].e = true;
    A['_latlngs'][0].s = true;
    B['_latlngs'][0].s = true;

    //console.log(A['_latlngs'])
    var hullsResult = _clip(
        [A['_latlngs']].concat(A['_holes']), [B['_latlngs']].concat(B['_holes']),
        //A['_latlngs'],
        //B['_latlngs'],
        sourceForwards, clipForwards);

    console.log('hulls result', JSON.stringify(hullsResult));

    return toLatLngs(hullsResult);

    console.groupEnd('hulls');

    var holesLength, holes, holeResult;

    console.log(sourceForwards, clipForwards)

    if (sourceForwards ^ clipForwards) {
        console.log(new Polygon(fromLatLngs(A['_latlngs'])).getPoints());
        hullsResult.push(new Polygon(fromLatLngs(A['_latlngs'])).getPoints())
        holesLength = (B['_holes'] ? B['_holes'].length : 0);
        holes = B['_holes'] || [];
        hullsResult.map(function(hull) {
            new Polygon(hull).clip()
        });
    } else {
        holesLength = (A['_holes'] ? A['_holes'].length : 0) +
            (B['_holes'] ? B['_holes'].length : 0);
        holes = (A['_holes'] || []).concat(B['_holes'] || []);
    }

    console.log('hulls', JSON.stringify(hullsResult))

    if (holesLength !== 0) {
        for (var j = 0, len = hullsResult.length; j < len; j++) {
            var source = new Polygon(hullsResult[j]),
                holeResult = [];
            for (var i = 0; i < holesLength; i++) {
                var clipped = source.clip(
                    new Polygon(fromLatLngs(holes[i])), !sourceForwards, clipForwards
                );
                console.log('clipped', clipped, !sourceForwards, clipForwards);
                if (clipped) {
                    holeResult = holeResult.concat(clipped);
                    console.log('holes removed', holeResult);
                }
            }
            if (holeResult && holeResult.length !== 0) {
                hullsResult[j] = holeResult;
                if (!(sourceForwards || clipForwards)) {
                    hullsResult[j].unshift(source.getPoints());
                }
            }
        }
    }

    console.log('got', JSON.stringify(hullsResult));
    console.groupEnd(op(sourceForwards, clipForwards));
    return formatResult(hullsResult);
};

function _clip(A, B, sourceForwards, clipForwards) {
    var source = [],
        clip = [],
        i, len;

    console.log(A, B)
    source = new Polygon(fromLatLngs(A));
    clip = new Polygon(fromLatLngs(B));

    return source.clip(clip, sourceForwards, clipForwards);
}

function formatResult(result) {
    if (result.length > 0) {
        for (var i = 0, len = result.length; i < len; i++) {
            result[i] = toLatLngs(result[i]);
        }

        return result;
    } else {
        return null;
    }
}

function fromLatLngs(latlngs) {
    console.log(latlngs)
    var pts = [],
        i = 0,
        len = latlngs.length;
    if (Array.isArray(latlngs[i])) {
        for (; i < len; i++) {
            pts.push(fromLatLngs(latlngs[i]));
        }
    } else {
        for (; i < len; i++) {
            pts.push([latlngs[i]['lng'], latlngs[i]['lat']]);
            pts[pts.length - 1].h = latlngs[i].h;
            pts[pts.length - 1].e = latlngs[i].e;
            pts[pts.length - 1].s = latlngs[i].s;
        }
    }
    return pts;
};

function toLatLngs(poly) {
    console.log(poly)
    if (poly[0].length && typeof poly[0][0] !== 'number') {
        var result = [];
        for (var i = 0, len = poly.length; i < len; i++) {
            result.push(_toLatLngs(poly[i]));
        }
        return result;
    } else {
        return _toLatLngs(poly);
    }
}

function _toLatLngs(poly) {
    var result = poly;

    if (result) {
        if (result[0][0] === result[result.length - 1][0] &&
            result[0][1] === result[result.length - 1][1]) {
            result = result.slice(0, result.length - 1);
        }

        for (var i = 0, len = result.length; i < len; i++) {
            result[i] = [result[i][1], result[i][0]];
        }
        return result;
    } else {
        return null;
    }
}
