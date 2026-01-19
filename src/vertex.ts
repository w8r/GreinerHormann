export default class Vertex {
  x: number;
  y: number;
  next: Vertex | null;
  prev: Vertex | null;
  _corresponding: Vertex | null;
  _distance: number;
  _isEntry: boolean;
  _isIntersection: boolean;
  _visited: boolean;

  /**
   * Vertex representation
   *
   * @param {number | number[] | {x: number, y: number}} x
   * @param {number=} y
   */
  constructor(x: number | number[] | { x: number; y: number }, y?: number) {
    let xCoord: number;
    let yCoord: number;

    if (arguments.length === 1) {
      // Coords
      if (Array.isArray(x)) {
        yCoord = x[1];
        xCoord = x[0];
      } else if (typeof x === 'object') {
        yCoord = x.y;
        xCoord = x.x;
      } else {
        xCoord = x;
        yCoord = 0;
      }
    } else {
      xCoord = x as number;
      yCoord = y as number;
    }

    /**
     * X coordinate
     */
    this.x = xCoord;

    /**
     * Y coordinate
     */
    this.y = yCoord;

    /**
     * Next node
     */
    this.next = null;

    /**
     * Previous vertex
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
     */
    this._isEntry = true;

    /**
     * Intersection vertex flag
     */
    this._isIntersection = false;

    /**
     * Loop check
     */
    this._visited = false;
  }

  /**
   * Creates intersection vertex
   */
  static createIntersection(x: number, y: number, distance: number): Vertex {
    const vertex = new Vertex(x, y);
    vertex._distance = distance;
    vertex._isIntersection = true;
    vertex._isEntry = false;
    return vertex;
  }

  /**
   * Mark as visited
   */
  visit(): void {
    this._visited = true;
    if (this._corresponding !== null && !this._corresponding._visited) {
      this._corresponding.visit();
    }
  }

  /**
   * Convenience
   */
  equals(v: Vertex): boolean {
    return this.x === v.x && this.y === v.y;
  }

  /**
   * Check if vertex is inside a polygon by odd-even rule:
   * If the number of intersections of a ray out of the point and polygon
   * segments is odd - the point is inside.
   */
  isInside(poly: any): boolean {
    let oddNodes = false;
    let vertex = poly.first;
    let next = vertex.next;
    const x = this.x;
    const y = this.y;

    do {
      if (
        ((vertex.y < y && next.y >= y) || (next.y < y && vertex.y >= y)) &&
        (vertex.x <= x || next.x <= x)
      ) {
        if (vertex.x + ((y - vertex.y) / (next.y - vertex.y)) * (next.x - vertex.x) < x) {
          oddNodes = !oddNodes;
        }
      }

      vertex = vertex.next;
      next = vertex.next || poly.first;
    } while (!vertex.equals(poly.first));

    return oddNodes;
  }
}
