define(['shim!Array.prototype.map'], function () {
    return function (object) {
        return Array.prototype.map.call(object, function (item) {
            return item;
        });
    };
});
