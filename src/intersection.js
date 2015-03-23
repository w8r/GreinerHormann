/**
 * Intersection
 * @param {Vertex} s1
 * @param {Vertex} s2
 * @param {Vertex} c1
 * @param {Vertex} c2
 * @constructor
 */
var Intersection = function(s1, s2, c1, c2) {

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

  /**
   * @type {Number}
   */
  this.x = s1.x + this.toSource * (s2.x - s1.x);

  /**
   * @type {Number}
   */
  this.y = s1.y + this.toSource * (s2.y - s1.y);

  if (!this.valid()) {

    /**
     * @type {Boolean}
     */
    this.isDegenerate = true;
  }
};

Intersection.prototype.onSourceEdge = function() {
  return (0 < this.toSource && this.toSource < 1);
};

Intersection.prototype.onClipEdge = function() {
  return (0 < this.toClip && this.toClip < 1);
};

/**
 * @return {Boolean}
 */
Intersection.prototype.valid = function() {
  return this.onSourceEdge() && this.onClipEdge();
};

module.exports = Intersection;
