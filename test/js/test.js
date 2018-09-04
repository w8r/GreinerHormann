import L from 'leaflet';
import leafletDraw from 'leaflet-draw';
import * as greinerHormann from '../../src/leaflet';


// Hong Kong
var map = L.map('map')
    .setView([22.2670, 114.188], 18),
    geoJSON = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [114.18723821640015, 22.26722012682322],
                        [114.18765127658844, 22.267458416642448],
                        [114.18758153915405, 22.267537846492015],
                        [114.18786585330963, 22.26769670605589],
                        [114.1885095834732, 22.26700665851556],
                        [114.18863832950592, 22.26687758449714],
                        [114.1888153553009, 22.26659461411705],
                        [114.18890118598938, 22.26637618044986],
                        [114.18857932090759, 22.266247105849885],
                        [114.18868660926819, 22.26647546852267],
                        [114.18798387050629, 22.266813047443286],
                        [114.18765664100646, 22.26715558992735],
                        [114.18736696243286, 22.26701162289852],
                        [114.18723821640015, 22.26722012682322]
                    ]
                ]
            }
        }]
    };

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' +
            '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    })
    .addTo(map);

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
            marker: false,
            circlemarker: false
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
        collisionPolygonOptions = {
            color: '#f00',
            fillColor: '#f00'
        },
        otherFeature, intersection, polygon;

    function addIntersectionPolygon(intersection) {
        var polygon = new L.Polygon(intersection, collisionPolygonOptions)
        polygon.addTo(map);
        polygons.push(polygon);
    }

    for (var i = 0, len = features.length; i < len; i++) {
        otherFeature = features[i];
        if (otherFeature === feature) {
            continue;
        }

        intersection = greinerHormann.intersection(otherFeature, feature);
        console.log(otherFeature, feature);
        console.log(intersection);

        polygons = [];

        if (intersection) {
            if (typeof intersection[0][0] === 'number') {
                addIntersectionPolygon(intersection);
            } else { // multiple
                for (var i = 0, len = intersection.length; i < len; i++) {
                    addIntersectionPolygon(intersection[i]);
                }
            }
        }
    }
});

// expose
window.map = map;
window.drawnItems = drawnItems;
window.polygons = polygons;

window.markers = markers;
