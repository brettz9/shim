/*globals define*/
// Should only be used with shims against standard behavior as normal modules should not set globals
define(['shim!Array', 'shim!Array.prototype.every'], {
    load: function (name, req, load, config) {
        'use strict';
        var i, prop, avoidLoad, w = window, ref = w,
            cfg = config.config,
            shim = cfg && cfg.shim,
            args = name.split('!'),
            aliased = args[0].split('@'),
            path = aliased[0],
            alias = aliased[1],
            module = alias || path,
            variable = alias ? path : path.split('/').slice(-1)[0],
            props = variable.split('.'),
            pl = props.length,
            methodChecks = args.slice(1),
            ml = methodChecks.length,
            typeCheck = function (detect, ref) {
                var detectType = typeof detect;
                switch (detectType) {
                    case 'boolean':
                        return detect;
                    case 'string':
                        return ref[detect];
                    case 'function':
                        return detect(ref);
                    case 'object':
                        return detect && (Array.isArray(detect) ?
                            (detect.every(function (method) {
                                return ref[method];
                            })) :
                            (detect.shim ? typeCheck(detect.shim, ref) : false)
                        );
                    default:
                        return false;
                }
            };

        if (ml || shim) {
            try {
                for (i = 0; i < pl; i++) {
                    try {
                        shim = shim[props[i]];
                    }
                    catch (e2) {
                        shim = false;
                    }
                    ref = ref[props[i]];
                }

                for (i = 0, avoidLoad = true; i < ml; i++) { // Allow style "shim!Array!slice"
                    avoidLoad &= !!ref[methodChecks[i]];
                }
                if (!ml && shim) { // Give a chance for config to handle
                    avoidLoad = typeCheck(shim, ref);
                }

                if (avoidLoad) {
                    load(true);
                    return;
                }
            }
            catch(e) {
            }
        }

        for (i = 0, ref = w; i < pl; i++) {
            prop = props[i];
            if (!ref[prop]) {
                ref[prop] = {};
            }
            ref = ref[prop];
        }

        req([module], function (obj) {
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    ref[prop] = obj[prop];
                }
            }
            load(false);
        });
    }
});