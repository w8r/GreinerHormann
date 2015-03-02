/**
 * Intersection
 * @param {Vertex} s1
 * @param {Vertex} s2
 * @param {Vertex} c1
 * @param {Vertex} c2
 * @constructor
 */
var Intersection = function(s1, s2, c1, c2) {
  // denomintator
  var d = (s2.x - s1.x) * (c2.y - c1.y) - (c2.x - c1.x) * (s2.y - s1.y);

  if (d === 0) { // parallel
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
    /**
     * @type {Number}
     */
    this.x = s1.x + this.toSource * (s2.x - s1.x);

    /**
     * @type {Number}
     */
    this.y = s1.y + this.toSource * (s2.y - s1.y);
  }
};

/**
 * Intersection point is on the segment
 * @return {Boolean}
 */
Intersection.prototype.valid = function() {
  return (0 < this.toSource && this.toSource < 1) && (0 < this.toClip && this.toClip < 1);
};

module.exports = Intersection;
