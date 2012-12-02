/*globals define*/
// Todos: Incorporate 'of' and 'from' from http://calormen.com/polyfill/harmony.js
//                while teasing out non-ECMAScript generics
// If allowing dynamic require, we could dynamically require these from
//   separate files so dependent, though still wouldn't be able to use our
//   current shim approach to define a group at once using the plug-in
define(['generics', 'shim!Array.prototype.forEach'], function (generics) {
    'use strict';
    var $Array = {
        isArray: function isArray (o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        }
    };
    // We can also build the array of methods with the following, but the 
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
