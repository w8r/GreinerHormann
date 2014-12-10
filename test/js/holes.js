var L = require('leaflet');
var greinerHormann = require('../../src/leaflet');
var drawIntersection = require('./draw_intersection');

var holed = require('../data/phole1.json');

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

        intersection = greinerHormann.union(feature, otherFeature);
        polygons = [];

        if (intersection) {
            if (typeof intersection[0][0] === 'number') {
                drawIntersection(intersection, map);
            } else { // multiple
                for (var i = 0, len = intersection.length; i < len; i++) {
                    // intersection[i].forEach(function(a) {
                    //     a.reverse();
                    // });

                    polygons.push(drawIntersection(intersection[i], map));
                }
            }
        }
    }

};
