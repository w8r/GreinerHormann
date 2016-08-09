[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
Greiner-Hormann polygon clipping
================================

 * Does AND, OR, XOR (intersection, union, difference, if you're human)
 * Plays nicely with [Leaflet](http://github.com/leaflet/leaflet/), comes with an adaptor for it
 * Handles non-convex polygons and multiple clipping areas
 * ~3kb compressed, no dependencies

[Demo and documentation](http://w8r.github.io/GreinerHormann/)

**Note:** If you are looking for something more powerful, take a look at the [Martinez polygon clipping](https://github.com/w8r/martinez) implementation.

## Install
```bash
$ npm install greiner-hormann
```

Browserify
```js
var greinerHormann = require('greiner-hormann');
```

Browser
```html
<script src="path/to/greiner-hormann(.leaflet).min.js"></script>
```

## Use
```js
...
var intersection = greinerHormann.intersection(source, clip);
var union        = greinerHormann.union(source, clip);
var diff         = greinerHormann.diff(source, clip);

...

if(intersection){
    if(typeof intersection[0][0] === 'number'){ // single linear ring
        intersection = [intersection];
    }
    for(var i = 0, len = intersection.length; i < len; i++){
        L.polygon(intersection[i], {...}).addTo(map);
    }
}
```

## Format
Input and output can be `{x:x, y:y}` objects or `[x,y]` pairs. It will output the points in the same format you put in.

