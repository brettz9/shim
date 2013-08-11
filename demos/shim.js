/*globals define*/
// Should only be used with shims against standard behavior as normal modules should not set globals
define(function () {
    'use strict';
    var shimPattern = /^([^.]*?)([^\/.]*)(\..*)$/;
    return {
        load: function (name, req, load, config) {
            var i, prop, module, variable, props, pl, replacer, actualPath,
                w = window, ref = w,
                shimConfig = (config.config && config.config.shim) || {},
                shimBaseUrl = (shimConfig.$baseUrl || 'shims').replace(/([^\/])$/, '$1/'), // We want this relative to the main module path (todo: see if https://github.com/jrburke/requirejs/issues/844 prompts support for separating the plugin baseUrl and module baseUrl, in which case use the module one)
                aliased = name.split('@'),
                alias = aliased[1],
                path = aliased[0],
                shimPathHasProtocol = shimBaseUrl.indexOf(':') > -1,
                shimAbsolutePath = shimBaseUrl.charAt() === '/';

            if (!alias) { // NOTE: If file size starts becoming a concern, we could scale back on the allowable values to just allow $pathDepth of "one" + $fileFormat of "full" (or revert back to a single autoNamespace variable); but this approach more flexibility to directory structure
                // Using example, "shim!Array.prototype.map", transform later to the file path...
                switch (shimConfig.$pathDepth) {
                    case 'one':
                        switch (shimConfig.$fileFormat) {
                            case 'remainder': // ...Array/prototype.map.js
                                replacer = function (n0, n1, n2, n3) {
                                    return n1 + n2 + '/' + n3;
                                };
                                break;
                            case 'full': default: // ...Array/Array.prototype.map.js (recommended form)
                                replacer = function (n0, n1, n2, n3) {
                                    return n1 + n2 + '/' + n2 + n3;
                                };
                                break;
                        }
                        break;
                    case 'full':
                        switch (shimConfig.$fileFormat) {
                            case 'index': // ...Array/prototype/map/index.js
                                replacer = function (n0, n1, n2, n3) {
                                    return (n2 + n3).replace(/\./g, '/') + '/index';
                                };
                                break;
                            case 'remainder': // ...Array/prototype/map.js
                                replacer = function (n0, n1, n2, n3) {
                                    return (n2 + n3).replace(/\./g, '/');
                                };
                                break;
                            case 'full': default: // ...Array/prototype/Array.prototype.map.js
                                replacer = function (n0, n1, n2, n3) {
                                    return (n2 + n3).replace(/\.[^.]*?$/, '') + '/' + n2 + n3;
                                };
                                break;
                        }
                        break;
                    case 'none': case 'default': default:
                        // ...Array.prototype.map.js
                        break;
                }
            }
            actualPath = path.replace(shimPattern, replacer);

            module = (
                (shimPathHasProtocol || shimAbsolutePath) ?
                    shimBaseUrl :
                    config.baseUrl + // .replace(/^\//, '')) + // config.baseUrl gets a trailing slash auto-added
                        shimBaseUrl
            ) + (alias || actualPath) + (shimPathHasProtocol || shimAbsolutePath ? '.js' : '');
            variable = alias ? path : // No need to split up the path if an alias file is being used as the "path" should really just be properties
                path.split('/').slice(-1)[0];
            props = variable.split('.');
            pl = props.length;

            try {
                for (i = 0; i < pl; i++) {
                    ref = ref[props[i]];
                }
                if (ref) {
                    load(true);
                    return;
                }
            }
            catch(e) {
            }

            for (i = 0, pl--, ref = w; i < pl; i++) {
                prop = props[i];
                if (!ref[prop]) {
                    ref[prop] = {};
                }
                ref = ref[prop];
            }

            req([module], function (value) {
                ref[props[i]] = value;
                load(false);
            });
        }
    };
});
