/**
 * Vertex representation
 *
 * @param {Number|Array.<Number>} x
 * @param {Number}                [y]
 * @constructor
 */
var Vertex = function(x, y) {

    // Coords
    if (Array.isArray(x)) {
        y = x[1];
        x = x[0];
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
Vertex.prototype.setChecked = function() {
    this._visited = true;
    if (this._corresponding !== null && !this._corresponding._visited) {
        this._corresponding.setChecked();
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
 */
Vertex.prototype.isInside = function(poly) {
    var intersections = 0,
        infinity = new Vertex(Infinity, this.y),
        vertex = poly.first,
        i;
    do {
        i = new Intersection(this, infinity, vertex, poly.getNext(vertex.next));
        if (!vertex._isIntersection && i.valid()) {
            intersections++;
        }
        vertex = vertex.next;
    } while (!vertex.equals(poly.first));

    return (intersections % 2) !== 0;
};
