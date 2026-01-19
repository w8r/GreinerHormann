import Vertex from './vertex';

export default class Intersection {
  x: number;
  y: number;
  toSource: number;
  toClip: number;

  /**
   * @param {Vertex} s1
   * @param {Vertex} s2
   * @param {Vertex} c1
   * @param {Vertex} c2
   */
  constructor(s1: Vertex, s2: Vertex, c1: Vertex, c2: Vertex) {
    /**
     * @type {number}
     */
    this.x = 0.0;

    /**
     * @type {number}
     */
    this.y = 0.0;

    /**
     * @type {number}
     */
    this.toSource = 0.0;

    /**
     * @type {number}
     */
    this.toClip = 0.0;

    const d = (c2.y - c1.y) * (s2.x - s1.x) - (c2.x - c1.x) * (s2.y - s1.y);

    if (d === 0) return;

    /**
     * @type {number}
     */
    this.toSource = ((c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)) / d;

    /**
     * @type {number}
     */
    this.toClip = ((s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)) / d;

    if (this.valid()) {
      this.x = s1.x + this.toSource * (s2.x - s1.x);
      this.y = s1.y + this.toSource * (s2.y - s1.y);
    }
  }

  /**
   * @return {boolean}
   */
  valid(): boolean {
    return 0 < this.toSource && this.toSource < 1 && 0 < this.toClip && this.toClip < 1;
  }
}
