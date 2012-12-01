shim
====

[requirejs](https://github.com/jrburke/requirejs/) plugin providing conditional shim loading, 
avoiding additional document loads when the feature is already detected as supported. 
Requires text ```shim!``` followed by file name (without ```.js```) where the latter must be 
expressed exactly as the global reference to detect.

Example
====
```javascript
// Avoids addiitonal load of Object.keys.js file if an Object.keys implementation is already available
require(['shim!Object.keys'], function (alreadyExisted) {
    alert(alreadyExisted); // gives false in IE quirks mode, true in Firefox, etc.
    alert(Object.keys({a: 1, b: 2})); // ['a','b']
});
```