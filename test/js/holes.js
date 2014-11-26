var L = require('leaflet');
var greinerHormann = require('../../src/leaflet');
var drawIntersection = require('./draw_intersection');

var holed = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [114.18702900409698, 22.266510219331515],
                    [114.18818771839142, 22.26744848790809],
                    [114.18896019458771, 22.26752791776328],
                    [114.18779611587523, 22.266266963488402],
                    [114.18747425079344, 22.26641093128335],
                    [114.18736696243286, 22.26659957851463],
                    [114.18702900409698, 22.266510219331515]
                ],
                [
                    [114.18793022632599, 22.26708112424127],
                    [114.18809652328491, 22.26689247765919],
                    [114.18832719326019, 22.26707615986078],
                    [114.188112616539, 22.267235019948806],
                    [114.18793022632599, 22.26708112424127]
                ]
            ]
        }
    }]
};

module.exports = function(map, geojson) {
    // Initialise the FeatureGroup to store editable layers
    var drawnItems = global.drawnItems = new L.GeoJSON(geojson);
    map.addLayer(drawnItems);

    var holedPoly = global.holedPoly = new L.GeoJSON(holed);
    map.addLayer(holedPoly);

    var features = drawnItems.getLayers(),
        feature = holedPoly.getLayers()[0],
        otherFeature, intersection, polygon;

    for (var i = 0, len = features.length; i < len; i++) {
        otherFeature = features[i];
        if (otherFeature === feature) {
            continue;
        }

        intersection = greinerHormann.diff(feature, otherFeature, false, true);
        console.log('result', intersection)

        polygons = [];

        if (intersection) {
            if (typeof intersection[0][0] === 'number') {
                drawIntersection(intersection, map);
            } else { // multiple
                for (var i = 0, len = intersection.length; i < len; i++) {
                    drawIntersection(intersection[i], map);
                }
            }
        }
    }


};
