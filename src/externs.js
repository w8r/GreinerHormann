/**
 * Externs file for google closure compiler
 */

// this makes GCC play with browserify

/**
 * @param {*=}o
 * @param {*=}u
 */
window.require = function(o, u) {};

/**
 * @type {Object}
 */
window.module = {
  exports: {}
};

/**
 * @type {Object}
 */
window.greinerHormann = {

  /**
   * @param  {Array.<Array.<Number>>} polygonA
   * @param  {Array.<Array.<Number>>} polygonB
   * @param  {Boolean=}               sourceForwards
   * @param  {Boolean=}               clipForwards
   * @return {Array.<Array.<Number>>|Null}
   */
  clip: function(polygonA, polygonB, sourceForwards, clipForwards) {},

  /**
   * @param  {Array.<Array.<Number>>} polygonA
   * @param  {Array.<Array.<Number>>} polygonB
   * @return {Array.<Array.<Number>>|Null}
   */
  diff: function(polygonA, polygonB) {},

  /**
   * @param  {Array.<Array.<Number>>} polygonA
   * @param  {Array.<Array.<Number>>} polygonB
   * @return {Array.<Array.<Number>>|Null}
   */
  union: function(polygonA, polygonB) {},

  /**
   * @param  {Array.<Array.<Number>>} polygonA
   * @param  {Array.<Array.<Number>>} polygonB
   * @return {Array.<Array.<Number>>|Null}
   */
  intersection: function(polygonA, polygonB) {}

};
