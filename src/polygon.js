var Vertex = require('./vertex');
var Intersection = require('./intersection');

/**
 * Polygon representation
 * @param {Array.<Array.<Number>>} p
 * @param {Boolean=}               arrayVertices
 *
 * @constructor
 */
var Polygon = function(p, arrayVertices) {

  /**
   * @type {Vertex}
   */
  this.first = null;

  /**
   * @type {Number}
   */
  this.vertices = 0;

  /**
   * @type {Vertex}
   */
  this._lastUnprocessed = null;

  /**
   * Whether to handle input and output as [x,y] or {x:x,y:y}
   * @type {Boolean}
   */
  this._arrayVertices = (typeof arrayVertices === "undefined") ?
    Array.isArray(p[0]) :
    arrayVertices;

  for (var i = 0, len = p.length; i < len; i++) {
    this.addVertex(new Vertex(p[i]));
  }
};

/**
 * Add a vertex object to the polygon
 * (vertex is added at the 'end' of the list')
 *
 * @param vertex
 */
Polygon.prototype.addVertex = function(vertex) {
  if (this.first == null) {
    this.first = vertex;
    this.first.next = vertex;
    this.first.prev = vertex;
  } else {
    var next = this.first,
      prev = next.prev;

    next.prev = vertex;
    vertex.next = next;
    vertex.prev = prev;
    prev.next = vertex;
  }
  this.vertices++;
};

/**
 * Inserts a vertex inbetween start and end
 *
 * @param {Vertex} vertex
 * @param {Vertex} start
 * @param {Vertex} end
 */
Polygon.prototype.insertVertex = function(vertex, start, end) {
  var prev;
  var curr = start;

  while ((curr !== end) && curr._distance < vertex._distance) {
    curr = curr.next;
  }

  vertex.next = curr;
  prev = curr.prev;

  vertex.prev = prev;
  prev.next = vertex;
  curr.prev = vertex;

  this.vertices++;
};

/**
 * Get next non-intersection point
 * @param  {Vertex} v
 * @return {Vertex}
 */
Polygon.prototype.getNext = function(v) {
  var c = v;
  while (c._isIntersection) {
    c = c.next;
  }
  return c;
};

/**
 * Unvisited intersection
 * @return {Vertex}
 */
Polygon.prototype.getFirstIntersect = function() {
  var v = this._firstIntersect || this.first;

  do {
    if (v._isIntersection && !v._visited) {
      break;
    }

    v = v.next;
  } while (v !== this.first);

  this._firstIntersect = v;
  return v;
};

/**
 * Does the polygon have unvisited vertices
 * @return {Boolean} [description]
 */
Polygon.prototype.hasUnprocessed = function() {
  var v = this._lastUnprocessed || this.first;
  do {
    if (v._isIntersection && !v._visited) {
      this._lastUnprocessed = v;
      return true;
    }

    v = v.next;
  } while (v !== this.first);

  this._lastUnprocessed = null;
  return false;
};

/**
 * The output depends on what you put in, arrays or objects
 * @return {Array.<Array<Number>|Array.<Object>}
 */
Polygon.prototype.getPoints = function() {
  var points = [],
    v = this.first;

  if (this._arrayVertices) {
    do {
      points.push([v.x, v.y]);
      v = v.next;
    } while (v !== this.first);
  } else {
    do {
      points.push({
        x: v.x,
        y: v.y
      });
      v = v.next;
    } while (v !== this.first);
  }

  return points;
};

/**
 * Clip polygon against another one.
 * Result depends on algorithm direction:
 *
 * Intersection: forwards forwards
 * Union:        backwars backwards
 * Diff:         backwards forwards
 *
 * @param {Polygon} clip
 * @param {Boolean} sourceForwards
 * @param {Boolean} clipForwards
 */
Polygon.prototype.clip = function(clip, sourceForwards, clipForwards) {
  var sourceVertex = this.first,
    clipVertex = clip.first,
    sourceInClip, clipInSource;

  // calculate and mark intersections
  do {
    if (!sourceVertex._isIntersection) {
      do {
        if (!clipVertex._isIntersection) {
          var i = new Intersection(
            sourceVertex,
            this.getNext(sourceVertex.next),
            clipVertex, clip.getNext(clipVertex.next));

          if (i.valid()) {
            var sourceIntersection = Vertex.createIntersection(i.x, i.y, i.toSource);
            var clipIntersection = Vertex.createIntersection(i.x, i.y, i.toClip);

            sourceIntersection._corresponding = clipIntersection;
            clipIntersection._corresponding = sourceIntersection;

            this.insertVertex(
              sourceIntersection,
              sourceVertex,
              this.getNext(sourceVertex.next));
            clip.insertVertex(
              clipIntersection,
              clipVertex,
              clip.getNext(clipVertex.next));
          }
        }
        clipVertex = clipVertex.next;
      } while (clipVertex !== clip.first);
    }

    sourceVertex = sourceVertex.next;
  } while (sourceVertex !== this.first);

  // phase two - identify entry/exit points
  sourceVertex = this.first;
  clipVertex = clip.first;

  sourceInClip = sourceVertex.isInside(clip);
  clipInSource = clipVertex.isInside(this);

  sourceForwards ^= sourceInClip;
  clipForwards ^= clipInSource;

  do {
    if (sourceVertex._isIntersection) {
      sourceVertex._isEntry = sourceForwards;
      sourceForwards = !sourceForwards;
    }
    sourceVertex = sourceVertex.next;
  } while (sourceVertex !== this.first);

  do {
    if (clipVertex._isIntersection) {
      clipVertex._isEntry = clipForwards;
      clipForwards = !clipForwards;
    }
    clipVertex = clipVertex.next;
  } while (clipVertex !== clip.first);

  // phase three - construct a list of clipped polygons
  var list = [];

  while (this.hasUnprocessed()) {
    var current = this.getFirstIntersect(),
      // keep format
      clipped = new Polygon([], this._arrayVertices);

    clipped.addVertex(new Vertex(current.x, current.y));
    do {
      current.visit();
      if (current._isEntry) {
        do {
          current = current.next;
          clipped.addVertex(new Vertex(current.x, current.y));
        } while (!current._isIntersection);

      } else {
        do {
          current = current.prev;
          clipped.addVertex(new Vertex(current.x, current.y));
        } while (!current._isIntersection);
      }
      current = current._corresponding;
    } while (!current._visited);

    list.push(clipped.getPoints());
  }

  if (list.length === 0) {
    if (sourceInClip) {
      list.push(this.getPoints());
    }
    if (clipInSource) {
      list.push(clip.getPoints());
    }
    if (list.length === 0) {
      list = null;
    }
  }

  return list;
};

module.exports = Polygon;
