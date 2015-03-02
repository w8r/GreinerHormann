var test = require('tape');
var fs = require('fs');
var gh = require('../src/greiner-hormann');
var Polygon = require('../src/polygon');


test('simple', function(t) {
  t.deepEqual(gh.intersection([
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
    [0, 0]
  ], [
    [10, 40],
    [110, 40],
    [110, 140],
    [10, 140],
    [10, 40]
  ]), [
    [
      [100, 40],
      [100, 100],
      [10, 100],
      [10, 40],
      [10, 40],
      [100, 40]
    ]
  ], 'simple [x,y] polygons intersection');

  t.deepEqual(gh.intersection([{
    x: 0,
    y: 0
  }, {
    x: 100,
    y: 0
  }, {
    x: 100,
    y: 100
  }, {
    x: 0,
    y: 100
  }, {
    x: 0,
    y: 0
  }], [{
    x: 10,
    y: 40
  }, {
    x: 110,
    y: 40
  }, {
    x: 110,
    y: 140
  }, {
    x: 10,
    y: 140
  }, {
    x: 10,
    y: 40
  }]), [
    [{
      x: 100,
      y: 40
    }, {
      x: 100,
      y: 100
    }, {
      x: 10,
      y: 100
    }, {
      x: 10,
      y: 40
    }, {
      x: 10,
      y: 40
    }, {
      x: 100,
      y: 40
    }]
  ], 'simple {x,y} intersection');

  t.end();
});

test('geojson', function(t) {
  var sp1 = JSON.parse(fs.readFileSync(__dirname + '/data/simple_poly1.json'));
  var sp2 = JSON.parse(fs.readFileSync(__dirname + '/data/simple_poly2.json'));
  var intersection_result = JSON.parse(fs.readFileSync(__dirname + '/data/simple_polys_intersection.json'));

  var intersection = gh.intersection(sp1.geometry.coordinates[0],
    sp2.geometry.coordinates[0]);

  t.deepEqual(
    gh.intersection(sp1.geometry.coordinates[0], sp2.geometry.coordinates[0]),
    intersection_result.geometry.coordinates,
    'flat geojson intersection');


  t.end();
});
