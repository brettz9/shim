/*globals define*/
// Should only be used with shims against standard behavior as normal modules should not set globals
define({
    load: function (name, req, load, config) {
        'use strict';
        var i, prop, w = window, ref = w,
            props = name.split('.'),
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

        req([name], function (value) {
            ref[props[i]] = value;
            load(false);
        });
    }
});