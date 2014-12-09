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
                    [114.1883319326019, 22.26717615986078],
                    [114.188112616539, 22.267235019948806],
                    [114.18793022632599, 22.26708112424127]
                ]
                /*,
                                [
                                    [114.18819308280945, 22.266932192750236],
                                    [114.18813943862914, 22.266862691333507],
                                    [114.18818771839142, 22.26682297622273],
                                    [114.1882413625717, 22.266897442046183],
                                    [114.18819308280945, 22.266932192750236]
                                ]*/
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

        // var A = feature,
        //     B = otherFeature;

        // (A._holes || []).forEach(function(h) {
        //     h[0].h = h[0].s = true;
        //     h.push(new L.LatLng(h[0].lat, h[0].lng));
        //     h[h.length - 1].e = true;
        // });

        // (B._holes || []).forEach(function(h) {
        //     h[0].h = h[0].s = true;
        //     h.push(new L.LatLng(h[0].lat, h[0].lng));
        //     h[h.length - 1].e = true;
        // });

        // A['_latlngs'].push(new L.LatLng(A['_latlngs'][0].lat, A['_latlngs'][0].lng));
        // B['_latlngs'].push(new L.LatLng(B['_latlngs'][0].lat, B['_latlngs'][0].lng));


        // drawIntersection(A['_latlngs'].concat([].concat.apply([], A['_holes'])), map);
        // drawIntersection(B['_latlngs'].concat([].concat.apply([], B['_holes'])), map);

        // continue;

        intersection = greinerHormann.intersection(feature, otherFeature);
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
