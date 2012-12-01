shim
====

[requirejs](https://github.com/jrburke/requirejs/) plugin providing conditional shim loading, 
avoiding additional document loads when the feature is already detected as supported. 
Requires the text `shim!` followed by file name (without `.js`, e.g., `Object.keys`) 
where the latter must be expressed exactly as the global reference to detect, and if not 
supported, create (and a module must be placed at `Object.keys.js`).

The `Object.keys.js` module should define the property/method to be automatically set at the 
supplied global file reference (e.g., the `Object.keys` function).

Example
====
```javascript
// Avoids addiitonal load of Object.keys.js file if an Object.keys implementation is already available
require(['shim!Object.keys'], function (alreadyExisted) {
    alert(alreadyExisted); // gives false in IE quirks mode, true in Firefox, etc.
    alert(Object.keys({a: 1, b: 2})); // ['a','b']
});
```