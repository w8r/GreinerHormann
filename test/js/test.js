var L = require('leaflet');
var greinerHormann = require('../../src/leaflet');
require('leaflet-draw');

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

var drawTest = require('./draw');
var holesTest = require('./holes');
var degradationTest = require('./degradation');

var parts = global.location.toString().split('?');

switch (parts[1]) {
    case 'holes':
        holesTest(map, geoJSON);
        break;
    case 'degradation':
        break;
    default:
        drawTest(map, geoJSON);
        break;
}

// expose
global.map = map;
