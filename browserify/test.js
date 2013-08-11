var punycode = require('punycode'); // Normal require

/* Shim requires */

require('shim!Array.prototype.map'); // Could also be stripped by a better implementation
require('shim!Array.of');

console.log(Array.of(1, 2, 3).map(function (item) {
    return item + 3;
}));