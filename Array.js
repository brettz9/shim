/*globals define*/
// If allowing dynamic require, we could dynamically require these from
//   separate files so dependent, though still wouldn't be able to use our
//   current shim approach to define a group at once using the plug-in
define(['generics', 'shim!Array.prototype.forEach'], function (generics) {
    'use strict';
    var ret = {};
    // We can also build the array of methods with the following, but the 
    //   getOwnPropertyNames() method is non-shimable:
    // Object.getOwnPropertyNames(Array).filter(function (methodName) {return typeof Array[methodName] === 'function'});
    [
        'join', 'reverse', 'sort', 'push', 'pop', 'shift', 'unshift',
        'splice', 'concat', 'slice', 'indexOf', 'lastIndexOf',
        'forEach', 'map', 'reduce', 'reduceRight', 'filter',
        'some', 'every', 'isArray'
    ].forEach(function (methodName) {
        ret[methodName] = generics.getArrayGeneric(methodName);
    });
    return ret;
});
