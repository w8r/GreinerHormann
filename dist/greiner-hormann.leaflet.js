/**
 * greiner-hormann v1.4.1
 * Greiner-Hormann clipping algorithm
 *
 * @author Alexander Milevski <info@w8r.name>
 * @license MIT
 * @preserve
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.greinerHormann = {})));
}(this, (function (exports) { 'use strict';

  var Vertex = function Vertex (x, y) {
    if (arguments.length === 1) {
      // Coords
      if (Array.isArray(x)) {
        y = x[1];
        x = x[0];
      } else {
        y = x.y;
        x = x.x;
      }
    }

    /**
     * X coordinate
     * @type {Number}
     */
    this.x = x;

    /**
     * Y coordinate
     * @type {Number}
     */
    this.y = y;

    /**
     * Next node
     * @type {Vertex}
     */
    this.next = null;

    /**
     * Previous vertex
     * @type {Vertex}
     */
    this.prev = null;

    /**
     * Corresponding intersection in other polygon
     */
    this._corresponding = null;

    /**
     * Distance from previous
     */
    this._distance = 0.0;

    /**
     * Entry/exit point in another polygon
     * @type {Boolean}
     */
    this._isEntry = true;

    /**
     * Intersection vertex flag
     * @type {Boolean}
     */
    this._isIntersection = false;

    /**
     * Loop check
     * @type {Boolean}
     */
    this._visited = false;
  };


  /**
   * Creates intersection vertex
   * @param{Number} x
   * @param{Number} y
   * @param{Number} distance
   * @return {Vertex}
   */
  Vertex.createIntersection = function createIntersection (x, y, distance) {
    var vertex = new Vertex(x, y);
    vertex._distance = distance;
    vertex._isIntersection = true;
    vertex._isEntry = false;
    return vertex;
  };


  /**
   * Mark as visited
   */
  Vertex.prototype.visit = function visit () {
    this._visited = true;
    if (this._corresponding !== null && !this._corresponding._visited) {
        this._corresponding.visit();
    }
  };


  /**
   * Convenience
   * @param{Vertex}v
   * @return {Boolean}
   */
  Vertex.prototype.equals = function equals (v) {
    return this.x === v.x && this.y === v.y;
  };


  /**
   * Check if vertex is inside a polygon by odd-even rule:
   * If the number of intersections of a ray out of the point and polygon
   * segments is odd - the point is inside.
   * @param {Polygon} poly
   * @return {Boolean}
   */
  Vertex.prototype.isInside = function isInside (poly) {
    var oddNodes = false;
    var vertex = poly.first;
    var next = vertex.next;
    var x = this.x;
    var y = this.y;

    do {
      if ((vertex.y < y && next.y >= y ||
             next.y < y && vertex.y >= y) &&
          (vertex.x <= x || next.x <= x)) {
        oddNodes ^= (vertex.x + (y - vertex.y) /
              (next.y - vertex.y) * (next.x - vertex.x) < x);
      }

      vertex = vertex.next;
      next = vertex.next || poly.first;
    } while (!vertex.equals(poly.first));

    return oddNodes;
  };

  var Intersection = function Intersection(s1, s2, c1, c2) {

    /**
     * @type {Number}
     */
    this.x = 0.0;

    /**
     * @type {Number}
     */
    this.y = 0.0;

    /**
     * @type {Number}
     */
    this.toSource = 0.0;

    /**
     * @type {Number}
     */
    this.toClip = 0.0;

    var d = (c2.y - c1.y) * (s2.x - s1.x) - (c2.x - c1.x) * (s2.y - s1.y);

    if (d === 0) { return; }

    /**
     * @type {Number}
     */
    this.toSource = ((c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)) / d;

    /**
     * @type {Number}
     */
    this.toClip = ((s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)) / d;

    if (this.valid()) {
        this.x = s1.x + this.toSource * (s2.x - s1.x);
        this.y = s1.y + this.toSource * (s2.y - s1.y);
    }
  };


  /**
   * @return {Boolean}
   */
  Intersection.prototype.valid = function valid () {
      return (0 < this.toSource && this.toSource < 1) && (0 < this.toClip && this.toClip < 1);
  };

  var Polygon = function Polygon (p, arrayVertices) {
    var this$1 = this;


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
      this$1.addVertex(new Vertex(p[i]));
    }
  };


  /**
   * Add a vertex object to the polygon
   * (vertex is added at the 'end' of the list')
   *
   * @param vertex
   */
  Polygon.prototype.addVertex = function addVertex (vertex) {
    if (this.first === null) {
      this.first    = vertex;
      this.first.next = vertex;
      this.first.prev = vertex;
    } else {
      var next = this.first;
      var prev = next.prev;

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
  Polygon.prototype.insertVertex = function insertVertex (vertex, start, end) {
    var prev, curr = start;

    while (!curr.equals(end) && curr._distance < vertex._distance) {
      curr = curr.next;
    }

    vertex.next = curr;
    prev      = curr.prev;

    vertex.prev = prev;
    prev.next = vertex;
    curr.prev = vertex;

    this.vertices++;
  };

  /**
   * Get next non-intersection point
   * @param{Vertex} v
   * @return {Vertex}
   */
  Polygon.prototype.getNext = function getNext (v) {
    var c = v;
    while (c._isIntersection) { c = c.next; }
    return c;
  };


  /**
   * Unvisited intersection
   * @return {Vertex}
   */
  Polygon.prototype.getFirstIntersect = function getFirstIntersect () {
    var v = this._firstIntersect || this.first;

    do {
      if (v._isIntersection && !v._visited) { break; }

      v = v.next;
    } while (!v.equals(this.first));

    this._firstIntersect = v;
    return v;
  };


  /**
   * Does the polygon have unvisited vertices
   * @return {Boolean} [description]
   */
  Polygon.prototype.hasUnprocessed = function hasUnprocessed () {
      var this$1 = this;

    var v = this._lastUnprocessed || this.first;
    do {
      if (v._isIntersection && !v._visited) {
        this$1._lastUnprocessed = v;
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
  Polygon.prototype.getPoints = function getPoints () {
    var points = [];
    var v = this.first;

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
   * Union:      backwars backwards
   * Diff:       backwards forwards
   *
   * @param {Polygon} clip
   * @param {Boolean} sourceForwards
   * @param {Boolean} clipForwards
   */
  Polygon.prototype.clip = function clip (clip$1, sourceForwards, clipForwards) {
      var this$1 = this;

    var sourceVertex = this.first;
    var clipVertex = clip$1.first;
    var sourceInClip, clipInSource;

    var isUnion      = !sourceForwards && !clipForwards;
    var isIntersection = sourceForwards && clipForwards;

    // calculate and mark intersections
    do {
      if (!sourceVertex._isIntersection) {
        do {
          if (!clipVertex._isIntersection) {
            var i = new Intersection(
              sourceVertex,
              this$1.getNext(sourceVertex.next),
              clipVertex, clip$1.getNext(clipVertex.next)
            );

            if (i.valid()) {
              var sourceIntersection = Vertex.createIntersection(i.x, i.y, i.toSource);
              var clipIntersection = Vertex.createIntersection(i.x, i.y, i.toClip);

              sourceIntersection._corresponding = clipIntersection;
              clipIntersection._corresponding = sourceIntersection;

              this$1.insertVertex(sourceIntersection, sourceVertex, this$1.getNext(sourceVertex.next));
              clip$1.insertVertex(clipIntersection, clipVertex, clip$1.getNext(clipVertex.next));
            }
          }
          clipVertex = clipVertex.next;
        } while (!clipVertex.equals(clip$1.first));
      }

      sourceVertex = sourceVertex.next;
    } while (!sourceVertex.equals(this.first));

      // phase two - identify entry/exit points
    sourceVertex = this.first;
    clipVertex = clip$1.first;

    sourceInClip = sourceVertex.isInside(clip$1);
    clipInSource = clipVertex.isInside(this);

    sourceForwards ^= sourceInClip;
    clipForwards ^= clipInSource;

    do {
      if (sourceVertex._isIntersection) {
        sourceVertex._isEntry = sourceForwards;
        sourceForwards = !sourceForwards;
      }
      sourceVertex = sourceVertex.next;
    } while (!sourceVertex.equals(this.first));

    do {
      if (clipVertex._isIntersection) {
        clipVertex._isEntry = clipForwards;
        clipForwards = !clipForwards;
      }
      clipVertex = clipVertex.next;
    } while (!clipVertex.equals(clip$1.first));

    // phase three - construct a list of clipped polygons
    var list = [];

    while (this.hasUnprocessed()) {
      var current = this$1.getFirstIntersect();
      // keep format
      var clipped = new Polygon([], this$1._arrayVertices);

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
      if (isUnion) {
        if (sourceInClip)    { list.push(clip$1.getPoints()); }
        else if (clipInSource) { list.push(this.getPoints()); }
        else                 { list.push(this.getPoints(), clip$1.getPoints()); }
      } else if (isIntersection) { // intersection
        if (sourceInClip)    { list.push(this.getPoints()); }
        else if (clipInSource) { list.push(clip$1.getPoints()); }
      } else { // diff
        if (sourceInClip)    { list.push(clip$1.getPoints(), this.getPoints()); }
        else if (clipInSource) { list.push(this.getPoints(), clip$1.getPoints()); }
        else                 { list.push(this.getPoints()); }
      }
      if (list.length === 0) { list = null; }
    }

    return list;
  };

  /**
   * Clip driver
   * @param  {L.Polygon} polygonA
   * @param  {L.Polygon} polygonB
   * @param  {Boolean} sourceForwards
   * @param  {Boolean} clipForwards
   * @return {Array.<L.LatLng>|null}
   */
  function boolean (polygonA, polygonB, sourceForwards, clipForwards) {
    var source = [], clip = [];

    var latlngs = polygonA['_latlngs'][0];
    for (var i = 0, len = latlngs.length; i < len; i++) {
        source.push([latlngs[i]['lng'], latlngs[i]['lat']]);
    }
    latlngs = polygonB['_latlngs'][0];
    for (var i$1 = 0, len$1 = latlngs.length; i$1 < len$1; i$1++) {
        clip.push([latlngs[i$1]['lng'], latlngs[i$1]['lat']]);
    }

    source = new Polygon(source),
    clip = new Polygon(clip);

    var result = source.clip(clip, sourceForwards, clipForwards);
    if (result && result.length > 0) {
      for (var i$2 = 0, len$2 = result.length; i$2 < len$2; i$2++) {
        result[i$2] = toLatLngs(result[i$2]);
      }

      if (result) {
        if (result.length === 1) { return result[0]; }
        else                     { return result; }
      } else { return null; }
    } else { return null; }
  }

  function toLatLngs(poly) {
    var result = poly;

    if (result) {
      if (result[0][0] === result[result.length - 1][0] &&
          result[0][1] === result[result.length - 1][1]) {
        result = result.slice(0, result.length - 1);
      }

      for (var i = 0, len = result.length; i < len; i++) {
        result[i] = [result[i][1], result[i][0]];
      }
      return result;
    } else {
      return null;
    }
  }

  /**
   * @api
   * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
   * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
   * @return {Array.<Array.<Number>>|Array.<Array.<Object>|Null}
   */
  function union (polygonA, polygonB) {
    return clip(polygonA, polygonB, false, false);
  }


  /**
   * @api
   * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
   * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
   * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
   */
  function intersection (polygonA, polygonB) {
    return clip(polygonA, polygonB, true, true);
  }


  /**
   * @api
   * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
   * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
   * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
   */
  function diff (polygonA, polygonB) {
    return clip(polygonA, polygonB, false, true);
  }


  var clip = boolean;

  exports.union = union;
  exports.intersection = intersection;
  exports.diff = diff;
  exports.clip = clip;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=greiner-hormann.leaflet.js.map
