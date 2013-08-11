/*globals define, require, module*/
if (typeof define !== 'function') { // We need this as Node will make it here as it does not yet support this shim
    var define = require('amdefine')(module);
}
define(function() {
    'use strict';
    return function () {
        // Could use array generics shim instead, but
        //   bulky and not standard
        return Array.prototype.slice.call(arguments);
    };
});
