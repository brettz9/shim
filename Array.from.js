/*globals define*/
define(['shim!Array.prototype.map'], function () {
    'use strict';
    return function (object) {
        return [].slice.call(object);
    };
});
