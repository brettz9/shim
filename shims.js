/*globals define*/
// Should only be used with shims against standard behavior as normal modules should not set globals
define(['shim!Array', 'shim!Array.prototype.every'], {
    load: function (name, req, load, config) {
        'use strict';
        var i, prop, avoidLoad, w = window, ref = w,
            cfg = config.config,
            detect = cfg && cfg.detect,
            args = name.split('!'),
            alias = args[0].split('@'),
            variable = alias[0],
            props = variable.split('.'),
            pl = props.length,
            methodChecks = args.slice(1),
            ml = methodChecks.length,
            typeCheck = function (detect, ref) {
                var ret, detectType = typeof detect;
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
                            (detect.detect ? typeCheck(detect.detect, ref) : false)
                        );
                    default:
                        return false;
                }
            };

        if (ml || detect) {
            try {
                for (i = 0; i < pl; i++) {
                    try {
                        detect = detect[props[i]];
                    }
                    catch (e2) {
                        detect = false;
                    }
                    ref = ref[props[i]];
                }

                for (i = 0, avoidLoad = true; i < ml; i++) { // Allow style "shim!Array!slice"
                    avoidLoad &= !!ref[methodChecks[i]];
                }
                if (!ml && detect) { // Give a chance for config to handle
                    avoidLoad = typeCheck(detect, ref);
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

        req([alias[1] || variable], function (obj) {
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    ref[prop] = obj[prop];
                }
            }
            load(false);
        });
    }
});