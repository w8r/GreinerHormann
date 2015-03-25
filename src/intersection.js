var Vertex = require('./vertex');

function False() {
  return false;
}

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

  if (d === 0) { // no intersection at all
    this.valid = False;
    this.isDegenerate = false;
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

    if ((this.toClip >= 0 && this.toClip <= 1) &&
      (this.toSource >= 0 && this.toSource <= 1)) {
      /**
       * @type {Boolean}
       */
      this.isDegenerate = true;
    }
  }
};

/**
 * Converts into vertex
 * @param  {Number} distance
 * @return {Vertex}
 */
Intersection.prototype.toVetrex = function(distance) {
  var vertex = new Vertex(this.x, this.y);
  vertex._distance = distance;
  vertex._isIntersection = true;

  return vertex;
};

/**
 * @return {Boolean}
 */
Intersection.prototype.onSourceEdge = function() {
  return (0 < this.toSource && this.toSource < 1);
};

/**
 * @return {Boolean}
 */
Intersection.prototype.onClipEdge = function() {
  return (0 < this.toClip && this.toClip < 1);
};

/**
 * Intersection point is on the segment
 * @return {Boolean}
 */
Intersection.prototype.valid = function() {
  return this.onSourceEdge() && this.onClipEdge();
};

module.exports = Intersection;
