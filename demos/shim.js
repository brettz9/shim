/*globals define*/
// Should only be used with shims against standard behavior as normal modules should not set globals
define({
    load: function (name, req, load, config) {
        'use strict';
        var i, prop, w = window, ref = w,
            shimConfig = (config.config && config.config.shim) || {},
            shimBaseUrl = shimConfig.baseUrl || 'shims', // We want this relative to the main module path (todo: see if https://github.com/jrburke/requirejs/issues/844 prompts support for separating the plugin baseUrl and module baseUrl, in which case use the module one)
            aliased = name.split('@'),
            alias = aliased[1],
            path = !alias && shimConfig.autoNamespace === 'main' ? (aliased[0].replace(/^([^.]*?)([^\/.]*)\..*$/, function (n0, n1, n2) {
                return n2 + '/';
            }) + aliased[0]) : aliased[0],
            shimPathHasProtocol = shimBaseUrl.indexOf(':') > -1,
            shimAbsolutePath = shimBaseUrl.charAt() === '/',
            module = (shimPathHasProtocol ? shimBaseUrl.replace(/([^\/])$/, '$1/') : (
                    (shimAbsolutePath ? '' : // We don't need the main requirejs baseUrl if the path is absolute
                        config.baseUrl.replace(/^\//, '')) + // config.baseUrl gets a trailing slash auto-added
                    (shimBaseUrl ? shimBaseUrl.replace(/([^\/])$/, '$1/') : '')
                )) + (alias || path) + (shimPathHasProtocol || shimAbsolutePath ? '.js' : ''),
            variable = alias ? path : // No need to split up the path if an alias file is being used as the "path" should really just be properties
                path.split('/').slice(-1)[0],
            props = variable.split('.'),
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
});