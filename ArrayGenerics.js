/*globals define*/

define(['generics', 'shim!Array.prototype'], function (generics) {
    'use strict';
    var $Array = {};
    // We could also build the array of methods with the following, but the
    //   getOwnPropertyNames() method is non-shimable:
    // Object.getOwnPropertyNames(Array).filter(function (methodName) {return typeof Array[methodName] === 'function'});
    [
        'join', 'reverse', 'sort', 'push', 'pop', 'shift', 'unshift',
        'splice', 'concat', 'slice', 'indexOf', 'lastIndexOf',
        'forEach', 'map', 'reduce', 'reduceRight', 'filter',
        'some', 'every', 'isArray'
    ].forEach(function (methodName) {
        $Array[methodName] = generics.getArrayGeneric(methodName);
    });
    return $Array;
});
