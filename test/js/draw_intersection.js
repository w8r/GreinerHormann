var L = require('leaflet');

module.exports = function(intersection, map) {
    var polygon = new L.Polygon(intersection, {
        color: '#f00',
        fillColor: '#f00'
    });
    polygon.addTo(map);
    return polygon;
};
