(function(root, factory) {
        if (typeof define === 'function' && define.amd) {
            define([], factory);
        } else if (typeof exports === 'object') {
            module.exports = factory();
        } else {
            /**
             * @api
             */
            root.greinerHormann = factory();
        }
    }(this, function() {
