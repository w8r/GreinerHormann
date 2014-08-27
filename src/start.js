/**
 * @preserve Licensed under MIT License
 */
(function(root, factory) {
        if (typeof define === 'function' && define.amd) {
            define([], factory);
        } else if (typeof exports === 'object') {
            module['exports'] = factory();
        } else {
            /**
             * @api
             * @export
             */
            window['greinerHormann'] = factory();
        }
    }(this, function() {
