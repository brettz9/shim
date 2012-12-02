shim
====

[requirejs](https://github.com/jrburke/requirejs/) plugin providing
conditional shim loading, avoiding additional document loads
when the feature is already detected as supported. Requires
the text `shim!` followed by a file name (without `.js`) where the
latter (e.g., `Object.keys`) must be expressed exactly as the
global reference to detect, and if not supported, create (and
a module must be placed at `Object.keys.js`).

The `Object.keys.js` module should define the
property/method to be automatically set at the
supplied global file reference (e.g., the `Object.keys` function).

Example 1
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
Example 2
====
```javascript
// The callback argument is not needed with shims; we can therefore supply all shim 
//   strings at the end of the require/define array to avoid needing to even define
//   the argument(s).
require(['someModule', 'shim!Object.keys'], 
    function (someModule) {
        someModule.doSomething();
        alert(Object.keys({a: 1, b: 2})); // ['a','b']
    }
);
```

For convenience, another plugin is provided to allow loading of
multiple shims at once, requiring the text `shims!` followed by a
file name as with `shim!` above, but also allowing subsequent
`!<method>` sequences where `<method>` references a
method name that is required to avoid loading the whole set of
shims (since we need to know which item to check to avoid loading the
file).

Example 3
====

```javascript
// We assume we can avoid addiitonal load of Array methods if map is already available
require(['writeBr', 'shims!Array.prototype!map'], function (writeBr) {
    writeBr([3, 4, 5, 6].map(function (i) {return i > 4;})); // [false, false, true, true]
});
```
Example 4
====

As an alternative means of avoiding loading of the multiple
shim file, `require.config` can be called with the `config` property
set to `detect` with an object following the structure of the object
(e.g., `Array.protoype` would be `{Array: {prototype : ... }}` where
the final value can either be a boolean to determine whether to
always avoid loading or not, a method name string to check against the
terminal object (e.g., against `Array.prototype`), an array of such
required method names, a callback accepting the terminal object
as argument and required to return a truthy value to avoid loading,
or an object with a `detect` property set to any of the same (for
cases when there is already a child property set--see the
example in `shims.html`).

Notice that the following example also demonstrates an ability
to add an ampersand (`@`) immediately after the variable name
in order to specify a (differently-named) module. This may be
especially useful in cases where there may be multiple shim
groups one may wish to load on a given variable (as opposed to
just multiple shims), such as when seeking to load both the
`Array` class methods (e.g., `Array.isArray`) as well as
Array generics. Multiple groups are desirable here because
Array generics are not standard, while the regular Array.js
file is reserved for standard methods.

```javascript
require.config({
    config: {
        detect : {
            // If both of the following methods are present on Array,
            //   the ArrayGenerics.js shim file will not be loaded as asserted
            //   to be not needed
            Array: ['slice', 'map']
        }
    }
});
require(['writeBr', 'shims!Array@ArrayGenerics'], function (writeBr) {
    writeBr(Array.slice([3, 4, 5, 6], 2)); // [5, 6]
});
```
