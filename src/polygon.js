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
  var prev, curr = start;

  while (!curr.equals(end) && curr._distance < vertex._distance) {
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
  } while (!v.equals(this.first));

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
  } while (!v.equals(this.first));

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
          var sourceNext = this.getNext(sourceVertex.next);
          var clipNext = clip.getNext(clipVertex.next);
          var i = new Intersection(
            sourceVertex, sourceNext,
            clipVertex, clipNext);

          if (i.valid()) {
            var sourceIntersection = Vertex.createIntersection(i.x, i.y, i.toSource);
            var clipIntersection = Vertex.createIntersection(i.x, i.y, i.toClip);

            sourceIntersection._corresponding = clipIntersection;
            clipIntersection._corresponding = sourceIntersection;

            this.insertVertex(sourceIntersection, sourceVertex, sourceNext);
            clip.insertVertex(clipIntersection, clipVertex, clipNext);

          } else if (i.isDegenerate) {
            var sourceIntersection, clipIntersection;

            if (i.onSourceEdge()) {
              sourceIntersection = Vertex.createIntersection(i.x, i.y, i.toSource);
              this.insertVertex(sourceIntersection, sourceVertex, sourceNext);
              sourceIntersection.isDegenerate = true;
            } else if (i.toSource === 0) {
              sourceIntersection = sourceVertex;
              sourceIntersection._isIntersection = true;
              sourceIntersection.isDegenerate = true;
            } else if (i.toSource === 1) {
              sourceIntersection = sourceNext;
              sourceIntersection.isDegenerate = true;
              sourceIntersection._isIntersection = true;
            }

            if (i.onClipEdge()) {
              clipIntersection = Vertex.createIntersection(i.x, i.y, i.toClip);
              this.insertVertex(clipIntersection, clipVertex, clipNext);
              clipIntersection.isDegenerate = true;
            } else if (i.toClip === 0) {
              clipIntersection = clipVertex;
              clipIntersection._isIntersection = true
              sourceIntersection.isDegenerate = true;
            } else if (i.toClip === 1) {
              clipIntersection = clipNext;
              sourceIntersection.isDegenerate = true;
            }

            if (sourceIntersection && clipIntersection) {
              sourceIntersection.type = clipIntersection.type = Vertex.ON;
              // sourceIntersection._isIntersection =
              //   clipIntersection._isIntersection = true;

              L.marker([i.y, i.x]).addTo(map);

              sourceIntersection._corresponding = clipIntersection;
              clipIntersection._corresponding = sourceIntersection;
            } else {
              console.log(sourceIntersection, clipIntersection);
            }
          }
        }
        clipVertex = clipVertex.next;
      } while (clipVertex !== clip.first);
    }

    sourceVertex = sourceVertex.next;
  } while (sourceVertex !== this.first);

  sourceVertex = this.first;
  do {
    if (sourceVertex.isDegenerate) {
      sourceVertex._isIntersection = true;
      sourceVertex._corresponding._isIntersection = true;
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

      var remove = (sourceVertex.equalTypes() &&
        sourceVertex._corresponding.equalTypes());

      this._markEntryExit(sourceVertex, sourceForwards, clipForwards, remove);
      this._markEntryExit(sourceVertex._corresponding, sourceForwards, clipForwards, remove);

      if (!remove && sourceVertex._isEntry === !sourceForwards &&
        sourceVertex._corresponding._isEntry === !clipForwards) {
        remove = true;
        sourceVertex.type = Vertex.OUT;
        sourceVertex._corresponding.type = Vertex.OUT;
      } else if (!remove && sourceVertex._isEntry === sourceForwards &&
        sourceVertex._corresponding._isEntry === clipForwards) {
        remove = true;
        sourceVertex.type = Vertex.IN;
        sourceVertex._corresponding.type = Vertex.IN;
      }

      if (remove) {
        sourceVertex._isIntersection = false;
        sourceVertex._corresponding._isIntersection = false;
      } else {

        // sourceVertex._isEntry = sourceForwards;
        sourceForwards = !sourceForwards;

        // clipVertex = sourceVertex._corresponding;
        // clipVertex._isEntry = clipForwards;
        clipForwards = !clipForwards;
      }
    }
    sourceVertex = sourceVertex.next;
  } while (!sourceVertex.equals(this.first));

  // do {
  //   if (clipVertex._isIntersection) {
  //     clipVertex._isEntry = clipForwards;
  //     clipForwards = !clipForwards;
  //   }
  //   clipVertex = clipVertex.next;
  // } while (!clipVertex.equals(clip.first));

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

Polygon.prototype._markEntryExit = function(curr, entry, nEntry, remove) {
  var type = curr.getType();
  if (type === Vertex.ON_ON) {
    if (!curr._corresponding.getType() === Vertex.ON_ON) {
      this._markEntryExit(curr._corresponding, nEntry, entry, remove);
      if (entry === nEntry) {
        curr._isEntry = !curr._corresponding._isEntry;
      } else {
        curr._isEntry = curr._corresponding._isEntry;
      }

      if (remove) {
        if (curr._corresponding.type === Vertex.IN) {
          curr.type = Vertex.OUT;
        } else {
          curr.type = Vertex.IN;
        }
      }
    } else {
      curr.type = Vertex.IN;
    }
  } else if (type === Vertex.OUT_OUT && remove) {
    curr.type = Vertex.OUT;
  } else if (type === Vertex.IN_IN && remove) {
    curr.type = Vertex.IN;
  } else if (type === Vertex.ON_OUT ||
    type === Vertex.IN_ON ||
    type === Vertex.IN_OUT) {
    curr._isEntry = !entry;
  } else if (type === Vertex.ON_IN ||
    type === Vertex.OUT_ON ||
    type === Vertex.OUT_IN) {
    curr._isEntry = entry;
  }
};

module.exports = Polygon;
