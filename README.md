[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Greiner-Hormann polygon clipping

 * Does AND, OR, difference (intersection, union, difference, if you're human)
 * Plays nicely with [Leaflet](http://github.com/leaflet/leaflet/), comes with an adaptor for it
 * Handles non-convex polygons and multiple clipping areas
 * ~4kb compressed, no dependencies
 * Written in TypeScript with full type definitions

[Demo and documentation](http://w8r.github.io/GreinerHormann/)

**Note:** If you are looking for something more powerful, take a look at the [Martinez polygon clipping](https://github.com/w8r/martinez) implementation.

## Install

```bash
npm install greiner-hormann
```

## Usage

### ES Modules (Recommended)

```typescript
import { intersection, union, diff } from 'greiner-hormann';

const polygon1 = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
  [0, 0]
];

const polygon2 = [
  [50, 50],
  [150, 50],
  [150, 150],
  [50, 150],
  [50, 50]
];

// Calculate intersection
const result = intersection(polygon1, polygon2);

// Calculate union
const combined = union(polygon1, polygon2);

// Calculate difference
const difference = diff(polygon1, polygon2);
```

### CommonJS

```javascript
const { intersection, union, diff } = require('greiner-hormann');

const result = intersection(polygon1, polygon2);
```

### Browser (UMD)

```html
<script src="path/to/greiner-hormann.umd.js"></script>
<script>
  const result = greinerHormann.intersection(polygon1, polygon2);
</script>
```

## Leaflet Integration

The library includes a Leaflet adaptor that works directly with Leaflet polygon objects:

```typescript
import { intersection, union, diff } from 'greiner-hormann/leaflet';
import L from 'leaflet';

// Create Leaflet polygons
const polygon1 = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047]
]);

const polygon2 = L.polygon([
  [51.508, -0.075],
  [51.502, -0.055],
  [51.515, -0.05]
]);

// Calculate intersection with Leaflet polygons
const result = intersection(polygon1, polygon2);

// Add result to map
if (result) {
  if (Array.isArray(result[0])) {
    // Single polygon result
    L.polygon(result, { color: 'red' }).addTo(map);
  } else {
    // Multiple polygons result
    result.forEach(poly => {
      L.polygon(poly, { color: 'red' }).addTo(map);
    });
  }
}
```

### Named Imports for Leaflet

You can use named imports to avoid conflicts with the main library:

```typescript
import { intersection, union, diff } from 'greiner-hormann';
import { 
  intersection as leafletIntersection, 
  union as leafletUnion, 
  diff as leafletDiff 
} from 'greiner-hormann/leaflet';

// Use with coordinate arrays
const coordResult = intersection(coordPolygon1, coordPolygon2);

// Use with Leaflet polygons
const leafletResult = leafletIntersection(leafletPolygon1, leafletPolygon2);
```

## Coordinate Format

Input and output can be `{x: number, y: number}` objects or `[x, y]` arrays. The library will output points in the same format you provide:

```typescript
// Array format
const arrayPolygon = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100]
];

// Object format
const objectPolygon = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 }
];

// Both work - output format matches input format
const result1 = intersection(arrayPolygon, arrayPolygon);   // Returns arrays
const result2 = intersection(objectPolygon, objectPolygon); // Returns objects
```

## TypeScript Support

The library is written in TypeScript and includes full type definitions:

```typescript
import { intersection, union, diff } from 'greiner-hormann';

type Point = [number, number] | { x: number; y: number };
type Polygon = Point[];

const polygon1: Polygon = [[0, 0], [10, 0], [10, 10], [0, 10]];
const polygon2: Polygon = [[5, 5], [15, 5], [15, 15], [5, 15]];

const result: Polygon[] | null = intersection(polygon1, polygon2);
```

## API

### `intersection(polygon1, polygon2)`

Returns the intersection of two polygons, or `null` if they don't intersect.

### `union(polygon1, polygon2)`

Returns the union of two polygons.

### `diff(polygon1, polygon2)`

Returns the difference of two polygons (polygon1 - polygon2).

