export default class Vertex {

  /**
   * Vertex representation
   *
   * @param {Number|Array.<Number>} x
   * @param {Number=}               y
   */
  constructor (x, y) {
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
  }


  /**
   * Creates intersection vertex
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} distance
   * @return {Vertex}
   */
  static createIntersection (x, y, distance) {
    const vertex = new Vertex(x, y);
    vertex._distance = distance;
    vertex._isIntersection = true;
    vertex._isEntry = false;
    return vertex;
  }


  /**
   * Mark as visited
   */
  visit () {
    this._visited = true;
    if (this._corresponding !== null && !this._corresponding._visited) {
        this._corresponding.visit();
    }
  }


  /**
   * Convenience
   * @param  {Vertex}  v
   * @return {Boolean}
   */
  equals (v) {
    return this.x === v.x && this.y === v.y;
  }


  /**
   * Check if vertex is inside a polygon by odd-even rule:
   * If the number of intersections of a ray out of the point and polygon
   * segments is odd - the point is inside.
   * @param {Polygon} poly
   * @return {Boolean}
   */
  isInside (poly) {
    let oddNodes = false;
    let vertex = poly.first;
    let next = vertex.next;
    const x = this.x;
    const y = this.y;

    do {
      if ((vertex.y < y && next.y   >= y ||
             next.y < y && vertex.y >= y) &&
          (vertex.x <= x || next.x <= x)) {
        oddNodes ^= (vertex.x + (y - vertex.y) /
              (next.y - vertex.y) * (next.x - vertex.x) < x);
      }

      vertex = vertex.next;
      next = vertex.next || poly.first;
    } while (!vertex.equals(poly.first));

    return oddNodes;
  }
}
