(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.greinerHormann = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Polygon = require('./polygon');

/**
 * Greiner-Hormann polygon clipping
 * @license MIT
 * @author Milevski Alexander (c) 2014
 * @preserve
 */


/**
 * Clip driver
 * @api
 * @param  {Array.<Array.<Number>>} polygonA
 * @param  {Array.<Array.<Number>>} polygonB
 * @param  {Boolean}                sourceForwards
 * @param  {Boolean}                clipForwards
 * @return {Array.<Array.<Number>>}
 */
module.exports = function(polygonA, polygonB, eA, eB) {
    var result, source = new Polygon(polygonA),
        clip = new Polygon(polygonB),
        result = source.clip(clip, eA, eB);

    return result;
};

},{"./polygon":4}],2:[function(require,module,exports){
var clip = require('./clip');

module.exports = {
    /**
     * @api
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
     * @return {Array.<Array.<Number>>|Array.<Array.<Object>|Null}
     */
    union: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, false, false);
    },

    /**
     * @api
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
     * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
     */
    intersection: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, true, true);
    },

    /**
     * @api
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
     * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
     */
    diff: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, false, true);
    },

    clip: clip
};

},{"./clip":1}],3:[function(require,module,exports){
/**
 * Intersection
 * @param {Vertex} s1
 * @param {Vertex} s2
 * @param {Vertex} c1
 * @param {Vertex} c2
 * @constructor
 */
var Intersection = function(s1, s2, c1, c2) {

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

    if (d === 0) {
        return;
    }

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
Intersection.prototype.valid = function() {
    return (0 < this.toSource && this.toSource < 1) && (0 < this.toClip && this.toClip < 1);
};

module.exports = Intersection;

},{}],4:[function(require,module,exports){
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

    var isUnion        = !sourceForwards && !clipForwards;
    var isIntersection = sourceForwards && clipForwards;
    var isDiff         = !isUnion && !isIntersection;

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
                        var sourceIntersection =
                            Vertex.createIntersection(i.x, i.y, i.toSource),
                            clipIntersection =
                            Vertex.createIntersection(i.x, i.y, i.toClip);

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
            } while (!clipVertex.equals(clip.first));
        }

        sourceVertex = sourceVertex.next;
    } while (!sourceVertex.equals(this.first));

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
    } while (!sourceVertex.equals(this.first));

    do {
        if (clipVertex._isIntersection) {
            clipVertex._isEntry = clipForwards;
            clipForwards = !clipForwards;
        }
        clipVertex = clipVertex.next;
    } while (!clipVertex.equals(clip.first));

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
        if (isUnion) {
            if (sourceInClip)      list.push(clip.getPoints());
            else if (clipInSource) list.push(this.getPoints());
            else                   list.push(this.getPoints(), clip.getPoints());
        } else if (isIntersection) { // intersection
            if (sourceInClip)      list.push(this.getPoints());
            else if (clipInSource) list.push(clip.getPoints());
        } else { // diff
            if (sourceInClip)      list.push(clip.getPoints(), this.getPoints());
            else if (clipInSource) list.push(this.getPoints(), clip.getPoints());
            else                   list.push(this.getPoints());
        }
        if (list.length === 0) list = null;
    }

    return list;
};

module.exports = Polygon;

},{"./intersection":3,"./vertex":5}],5:[function(require,module,exports){
/**
 * Vertex representation
 *
 * @param {Number|Array.<Number>} x
 * @param {Number=}               y
 *
 * @constructor
 */
var Vertex = function(x, y) {

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
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} distance
 * @return {Vertex}
 */
Vertex.createIntersection = function(x, y, distance) {
    var vertex = new Vertex(x, y);
    vertex._distance = distance;
    vertex._isIntersection = true;
    vertex._isEntry = false;
    return vertex;
};

/**
 * Mark as visited
 */
Vertex.prototype.visit = function() {
    this._visited = true;
    if (this._corresponding !== null && !this._corresponding._visited) {
        this._corresponding.visit();
    }
};

/**
 * Convenience
 * @param  {Vertex}  v
 * @return {Boolean}
 */
Vertex.prototype.equals = function(v) {
    return this.x === v.x && this.y === v.y;
};

/**
 * Check if vertex is inside a polygon by odd-even rule:
 * If the number of intersections of a ray out of the point and polygon
 * segments is odd - the point is inside.
 * @param {Polygon} poly
 * @return {Boolean}
 */
Vertex.prototype.isInside = function(poly) {
    var oddNodes = false,
        vertex = poly.first,
        next = vertex.next,
        x = this.x,
        y = this.y;

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

module.exports = Vertex;

},{}]},{},[2])(2)
});