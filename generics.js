/*globals define*/
define(['shim!Array.from'], function () {
    'use strict';
        return {
        buildGeneric: function buildGeneric (method) {
            return function (arg1) {
                return method.apply(arg1, Array.from(arguments).slice(1));
            };
        },
        getGeneric: function getGeneric (obj, methodName) {
            return this.buildGeneric(obj.prototype[methodName]);
        },
        getArrayGeneric: function getArrayGeneric (methodName) {
            return this.getGeneric(Array, methodName);
        },
        getStringGeneric: function getStringGeneric (methodName) {
            return this.getGeneric(String, methodName);
        },
        assignGeneric: function assignGeneric (obj, methodName) {
            obj[methodName] = this.getGeneric(obj, methodName);
        },
        assignArrayGeneric: function assignArrayGeneric (methodName) {
            this.assignGeneric(Array, methodName);
        },
        assignStringGeneric: function assignStringGeneric (methodName) {
            this.assignGeneric(String, methodName);
        }
    };
});
