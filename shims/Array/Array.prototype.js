// Todos: add others
/*globals define, require, module*/
if (typeof define !== 'function') { // We need this as Node will make it here as it does not yet support this shim
    var define = require('amdefine')(module);
}

define(['shim!Array.prototype.indexOf', 'shim!Array.prototype.lastIndexOf', 'shim!Array.prototype.every', 'shim!Array.prototype.filter', 'shim!Array.prototype.forEach', 'shim!Array.prototype.map', 'shim!Array.prototype.some'], function () {
    'use strict';
    // No need for content
});
