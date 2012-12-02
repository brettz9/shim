/*globals define*/
define(function() {
    'use strict';
    return function () {
        // Could use array generics shim instead, but
        //   bulky and not standard
        return Array.prototype.slice.call(arguments);
    };
});
