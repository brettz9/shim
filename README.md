shim
====

[requirejs](https://github.com/jrburke/requirejs/) plugin providing conditional shim loading, 
avoiding additional document loads when the feature is already detected as supported. 
Requires the text `shim!` followed by file name (without `.js`, e.g., `Object.keys`) 
where the latter must be expressed exactly as the global reference to detect, and if not 
supported, create (and a module must be placed at `Object.keys.js`).

The `Object.keys.js` module should define the property/method to be automatically set at the 
supplied global file reference (e.g., the `Object.keys` function).

Examples
====
```javascript
// We avoid addiitonal load of the Object.keys.js file if an Object.keys implementation is already available

require(['shim!Object.keys'], 
    //   We can include the argument "alreadyExisted" for demonstration of whether the browser already
    //     had an implementation available to it, but should usually not be necessary
    function (alreadyExisted) {
        alert(alreadyExisted); // gives false in IE quirks mode, true in Firefox, etc.
        alert(Object.keys({a: 1, b: 2})); // ['a','b']
    }
);
```

```javascript
// The callback argument is not needed with shims; we can therefore supply all shim 
//   strings at the end of the require/define array to avoid needing to even define
//   the argument(s).
require(['someModule', 'shim!Object.keys'], 
    function (someModule1) {
        someModule.doSomething();
        alert(Object.keys({a: 1, b: 2})); // ['a','b']
    }
);
```