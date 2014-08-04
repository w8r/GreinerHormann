// ES5 15.4.3.2 Array.isArray ( arg )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
Array.isArray = Array.isArray || function(o) {
    return Boolean(o && Object.prototype.toString.call(Object(o)) === '[object Array]');
};
