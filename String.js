/*globals define*/
// If allowing dynamic require, we could dynamically require these from
//   separate files so dependent, though still wouldn't be able to use our
//   current shim approach to define a group at once using the plug-in
define(['generics', 'shim!Array.prototype.forEach'], function (generics) {
    'use strict';
    var ret = {};
    // We can also build the array of methods with the following, but the 
    //   getOwnPropertyNames() method is non-shimable:
    // Object.getOwnPropertyNames(String).filter(function (methodName) {return typeof String[methodName] === 'function'});
    [
        'quote', 'substring', 'toLowerCase', 'toUpperCase', 'charAt', 
        'charCodeAt', 'indexOf', 'lastIndexOf', 'startsWith', 'endsWith', 
        'trim', 'trimLeft', 'trimRight', 'toLocaleLowerCase', 
        'toLocaleUpperCase', 'localeCompare', 'match', 'search', 
        'replace', 'split', 'substr', 'concat', 'slice', 'fromCharCode'
    ].forEach(function (methodName) {
        ret[methodName] = generics.getStringGeneric(methodName);
    });
    return ret;
});
