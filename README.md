# shim

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

# Examples

## Example 1

```javascript
// We avoid additional load of the Object.keys.js file if an Object.keys implementation is already available

require(['shim!Object.keys'], 
    //   We can include the argument "alreadyExisted" for demonstration of whether the browser already
    //     had an implementation available to it, but should usually not be necessary
    function (alreadyExisted) {
        alert(alreadyExisted); // gives false in IE quirks mode, true in Firefox, etc.
        alert(Object.keys({a: 1, b: 2})); // ['a','b']
    }
);
```

## Example 2

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

## Example 3

For convenience, another plugin is provided to allow loading of
multiple shims at once, requiring the text `shims!` followed by a
file name as with `shim!` above, but also allowing subsequent
`!<method>` sequences where `<method>` references a
method name that is required to avoid loading the whole set of
shims (since we need to know which item to check to avoid loading the
file).

```javascript
// We assume we can avoid addiitonal load of Array methods if map is already available
require(['writeBr', 'shims!Array.prototype!map'], function (writeBr) {
    writeBr([3, 4, 5, 6].map(function (i) {return i > 4;})); // [false, false, true, true]
});
```

## Example 4

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
to add an alias (via an ampersand (`@`) immediately after the
variable name) in order to specify a (differently-named) module.
This may be especially useful in cases where there may be multiple
shim groups one may wish to load on a given variable (as opposed to
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

# Browserify

For users of browserify, I have added a very simple browserify transforming plugin
to convert require('!shim...') statements into checks for existence of the global and conditional
require-based usage of the shim

```browserify -t shimify main.js > bundle.js```

...which will convert:

```javascript
// Currently requires separate requires for each shim (see below)
require('shim!Array.prototype.indexOf');
require('shim!ArrayBuffer');
```

...into:
```javascript
!Array.prototype.indexOf ? require('./shims/Array.prototype.indexOf') : '';
typeof ArrayBuffer !== 'undefined' ? require('./shims/ArrayBuffer') : '';
```

There are a number of shortcomings (pull requests welcome!):

1. The real shim file (assuming it is needed) is always assumed to be within the "./shims/" path. (If browserify transformations can accept additional (config) arguments, we might accept the same format as used in the RequireJS AMD shim plugin.
2. There is not a lot of checking about the context when replacing `require(!shim...)` statements (if the statement is added where the previous line is a function missing an ending semicolon?) which could cause errors.
3. The syntax does not support all features of the RequireJS shim plugin syntax
4. Does not currently check for each component's existence (e.g., checking "Array.prototype.indexOf" does not first verify Array.prototype exists).
5. I have not allowed the require to accept an array of shims even though the transformer could handle it; I first want to see whether it is possible to overload the built-in Node require and if so, whether it can handle the array format.

I would also like to add an option to strip `require('!shim...')'` entirely without disturbing line numbers (e.g., to use in browser (or Node) which doesn't need shim code loaded or checked) and an option to convert to a genuine require without first checking whether the global exists or not (e.g., for IE-only (conditional-comment-loaded) shim file where one knows that the global is missing).

(I'd also like to make such an equivalent plugin for [AsYouWish](https://github.com/brettz9/asyouwish/wiki/Developer-Guidelines#requirejs-priv-plugin) to support another needed-in-the-browser-but-not-the-server need.)

# Todos

1. Merge shims into shim including alias/detection behavior (need to add a special character at end to get shims behavior?)
1. Ensure shim plugin works in Node RequireJS
1. Start populating shims at the polyfill wiki and npm! (including latest Array.prototype.slice work or any other gist/desktop shim work) according to best cross-environment support; add to separate repo indicating strict rules so this plugin size can be small and itself modular?

# Possible todos

1. Support npm-constrained file name conversion since useful to host browser shims with npm for easy install but upper-case and dots are not allowed in the file names we use for auto-detection. (The plugin would probably also need to be changed to look inside the node_modules directory)
1. Add other autoNamespace formats (e.g., Array/prototype/map.js, Array/prototype.map.js) in addition to the existing default format (Array.prototype.map.js) and to the one-level nesting autoNamespace === 'main' format (Array/Array.prototype.map.js)

# Rejected ideas

1. Apply autoNamepsace to aliases (using the path portion). While this might be convenient in some cases (e.g., to reference array generics in an Array folder without repeating "Array" in the alias portion), one should have the freedom to store them elsewhere (e.g., in a "generics" folder outside of the shim folder), and one might not expect changes to an alias anyways.
