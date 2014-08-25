return {
    /**
     * @api
     * @param  {Array.<Array.<Number>} polygonA
     * @param  {Array.<Array.<Number>} polygonB
     * @return {Array.<Array.<Number>>|Null}
     */
    union: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, false, false);
    },

    /**
     * @api
     * @param  {Array.<Array.<Number>} polygonA
     * @param  {Array.<Array.<Number>} polygonB
     * @return {Array.<Array.<Number>>|Null}
     */
    intersection: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, true, true);
    },

    /**
     * @api
     * @param  {Array.<Array.<Number>} polygonA
     * @param  {Array.<Array.<Number>} polygonB
     * @return {Array.<Array.<Number>>|Null}
     */
    diff: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, false, true);
    }
};

}));
