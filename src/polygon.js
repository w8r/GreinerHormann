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
     * @type {Boolean}
     */
    this._sourceInClip = false;

    /**
     * @type {Boolean}
     */
    this._clipInSource = false;

    /**
     * Whether to handle input and output as [x,y] or {x:x,y:y}
     * @type {Boolean}
     */
    this._arrayVertices = (typeof arrayVertices === "undefined") ?
        Array.isArray(p[0][0]) :
        arrayVertices;

    //    var first, ultimateFirst = null;
    for (var i = 0, len = p.length; i < len; i++) {
        this._addVertices(p[i]);
        if (this.first) {
            this.first.prev.close = true;
        }
    }
};

/**
 * @param {Arra.<Array.<Number>|Array.<Object>} p
 */
Polygon.prototype._addVertices = function(p, hull) {
    for (var i = 0, len = p.length; i < len; i++) {
        this.addVertex(p[i]);
    }
};

/**
 * Add a vertex object to the polygon
 * (vertex is added at the 'end' of the list')
 *
 * @param {Array.<Number>} vertex
 */
Polygon.prototype.addVertex = function(vertex) {
    vertex = new Vertex(vertex);
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

    while (curr !== end && curr._distance < vertex._distance) {
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

    if (v) {
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
    }

    return points;
};

Polygon.prototype._debugSegments = function(s1, s2, c1, c2, color1, color2) {
    if (this._s1) {
        global.map.removeLayer(this._s1);
        this._s1 = null;
    }
    if (s1 && s2) {
        this._s1 = new global.L.Polyline([
            [s1.y, s1.x],
            [s2.y, s2.x]
        ], {
            color: color1 || '#f00',
            weight: 3,
            opacity: 1
        });
        this._s1.addTo(global.map);
    }

    if (this._s2) {
        global.map.removeLayer(this._s2);
        this._s2 = null;
    }
    if (c1 && c2) {
        this._s2 = new global.L.Polyline([
            [c1.y, c1.x],
            [c2.y, c2.x]
        ], {
            color: color2 || '#0f0',
            weight: 3,
            opacity: 1
        });
        this._s2.addTo(global.map);
    }

    debugger;
};

/**
 * Calculate and mark intersections
 * @param  {Polygon} clip
 */
Polygon.prototype.processIntersections = function(clip) {
    var sourceVertex = this.first,
        clipVertex = clip.first,
        s = false;

    do {

        if (!sourceVertex._isIntersection) {

            do {

                if (clipVertex.close || clipVertex.close) {
                    //this._debugSegments(sourceVertex, this.getNext(sourceVertex.next),
                    //clipVertex, clip.getNext(clipVertex.next));
                    //     s = true;
                    // } else if (sourceVertex.end) {
                    //     this._debugSegments(sourceVertex, this.getNext(sourceVertex.next),
                    //         clipVertex, clip.getNext(clipVertex.next), '#f0f', '#0ff');
                    //     s = true;
                    // } else {
                    //     s = false;
                }

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

                        if (clipVertex.close || sourceVertex.close) {
                            clipIntersection.invalid = true;
                            sourceIntersection.invalid = true;

                            // this._debugSegments(sourceVertex,
                            //     this.getNext(sourceVertex.next),
                            //     clipVertex, clip.getNext(clipVertex.next));
                        }

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
            }
            while (clipVertex !== clip.first);
        }

        sourceVertex = sourceVertex.next;
    }
    while (sourceVertex !== this.first);
};

/**
 * Phase two - identify entry/exit points
 *
 * @param  {Polygon} clip
 * @param  {Boolean} sourceForwards
 * @param  {Boolean} clipForwards
 */
Polygon.prototype.processEntryExits = function(clip, sourceForwards, clipForwards) {
    var sourceVertex = this.first,
        clipVertex = clip.first,
        sourceInClip, clipInSource;

    this._sourceInClip = sourceVertex.isInside(clip);
    this._clipInSource = clipVertex.isInside(this);

    sourceForwards ^= this._sourceInClip;
    clipForwards ^= this._clipInSource;

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
};

/**
 * Phase three - construct a list of clipped polygons
 * @param  {Polygon} clip
 * @return {Array}
 */
Polygon.prototype.buildClippedPolygons = function(clip) {
    var list = [],
        raw = [],
        v;

    while (this.hasUnprocessed()) {
        var current = this.getFirstIntersect(),
            // keep format
            clipped = new Polygon([
                []
            ], this._arrayVertices);

        do {
            current.visit();
            if (current._isEntry) {
                var skip = false;
                do {
                    if (current.invalid) alert(2)
                    current = current.next;
                    v = new Vertex(current);

                    v.start = current.start;
                    v.end = current.end;
                    v.hole = current.hole;
                    v.invalid = current.invalid;
                    v.close = current.close;

                    clipped.addVertex(v);
                } while (!current._isIntersection);

            } else {
                do {
                    if (current.invalid) alert(2)
                    current = current.prev;
                    v = new Vertex(current);

                    v.start = current.start;
                    v.end = current.end;
                    v.hole = current.hole;
                    v.invalid = current.invalid;
                    v.close = current.close;

                    clipped.addVertex(v);
                } while (!current._isIntersection);
            }
            current = current._corresponding || current.next;
        } while (!current._visited);

        // tail
        //list.push(d.getPoints());
        list.push(clipped.getPoints());
        raw.push(clipped);
    }
    this.processResultPolygons(raw);

    //list.pop();

    if (list.length === 0) {
        if (this._sourceInClip) {
            list.push(this.getPoints());
        }
        if (this._clipInSource) {
            list.push(clip.getPoints());
        }
        if (list.length === 0) {
            list = null;
        }
    }
    return list;
};


/**
 * Idea: traversing through the polygon -> found `invalid` intersection ->
 * try and make a ring until you meet the same `invalid` intersection point
 * again -> if success, wrap it all in another array and go back to the outer
 * ring
 *
 * @type {[type]}
 */
Polygon.prototype.processResultPolygons = function(polygons) {
    for (var i = 0, len = polygons.length; i < len; i++) {
        var polygon = polygons[i],
            current = polygon.first;
        do {
            this._debugSegments(current.prev, current, current, current.next);
            if (current.invalid) alert(1)
            current = current.next;
        } while (current !== polygon.first);
    }
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

    this.processIntersections(clip);

    this.processEntryExits(clip, sourceForwards, clipForwards);

    return this.buildClippedPolygons(clip);
};

module.exports = Polygon;
