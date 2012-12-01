// Should only be used with shims against standard behavior as normal modules should not set globals
define({
    load: function (name, req, load, config) {
        var i, pl, ref = window, 
            props = name.split('.');

        try {
            for (i = 0, pl = props.length; i < pl; i++) {
                ref = ref[props[i]];
            }
        }
        catch(e) {
        }
        if (ref && i === pl) {
            load(true);
            return;
        }
        
        req([name], function (value) {
            load(value);
        });
    }
});