var L = require('leaflet');
var greinerHormann = require('../../src/leaflet');
require('leaflet-draw');

L.Icon.Default.imagePath = 'lib/leaflet/images';

// Hong Kong
var map = global.map = L.map('map', {
        maxZoom: 22
    })
    .setView([22.2670, 114.188], 18),
    geoJSON = require('../data/base_poly.json');

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
    case 'draw':
    default:
        drawTest(map, geoJSON);
        break;
}

// expose
global.map = map;
