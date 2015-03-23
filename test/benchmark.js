var gh = require('../src/greiner-hormann');
var Benchmark = require('benchmark');
var fs = require('fs');

var armenia = JSON.parse(fs.readFileSync(__dirname + '/data/simple/armenia.json'));
var simple = JSON.parse(fs.readFileSync(__dirname + '/data/simple/intersect1.json'));
var suite = new Benchmark.Suite('greiner-hormann');

suite
  .add('gh-intersect#simple', function() {
    gh.intersection(simple.features[0].geometry.coordinates[0], simple.features[1].geometry.coordinates[0]);
  })
  .add('gh-intersect#armenia', function() {
    gh.intersection(armenia.features[0].geometry.coordinates[0], armenia.features[2].geometry.coordinates[0]);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {

  })
  .run();
