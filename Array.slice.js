/*globals define*/
// Array.slice.js
define(['generics'], function (generics) {
    'use strict';
    return function () {
        return generics.getArrayGeneric('slice');
    };
});