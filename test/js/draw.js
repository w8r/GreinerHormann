var L = require('leaflet');
var greinerHormann = require('../../src/leaflet');
var drawIntersection = require('./draw_intersection');


module.exports = function(map, geoJSON) {
    // Initialise the FeatureGroup to store editable layers
    var drawnItems = new L.GeoJSON(geoJSON);
    map.addLayer(drawnItems);

    var markers = new L.FeatureGroup();
    map.addLayer(markers);

    // Initialise the draw control and pass it the FeatureGroup of
    // editable layers
    var drawControl = new L.Control.Draw({
            draw: {
                polyline: false,
                circle: false,
                marker: false
            },
            edit: {
                featureGroup: drawnItems
            }
        }),
        polygons;
    map.addControl(drawControl);

    // add it to the map
    map.on('draw:created', function(evt) {
        drawnItems.addLayer(evt.layer);
    });

    // scan for collisions
    map.on('draw:created', function(evt) {
        var features = drawnItems.getLayers(),
            feature = evt.layer,
            otherFeature, intersection, polygon;

        for (var i = 0, len = features.length; i < len; i++) {
            otherFeature = features[i];
            if (otherFeature === feature) {
                continue;
            }

            intersection = greinerHormann.intersection(otherFeature, feature);

            polygons = [];

            if (intersection) {
                if (typeof intersection[0][0] === 'number') {
                    polygons.push(drawIntersection(intersection, map));
                } else { // multiple
                    for (var i = 0, len = intersection.length; i < len; i++) {
                        polygons.push(drawIntersection(intersection[i], map));
                    }
                }
            }
        }
    });


    global.drawnItems = drawnItems;
    global.polygons = polygons;

    global.markers = markers;
};
