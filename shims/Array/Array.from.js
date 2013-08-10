/*globals define*/
define(function () {
    'use strict';
    return function (object) {
        return [].slice.call(object);
    };
});
