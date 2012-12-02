/*globals define*/
define(['shim!Array.prototype.map'], function () {
    'use strict';
    return function (object) {
        return Array.prototype.map.call(object, function (item) {
            return item;
        });
    };
});
