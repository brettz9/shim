// Requires requirejs dependency (as specified in package.json) for Node usage; also works in browser

// Set up regretttably-necessary boilerplate at top of pipeline (though could be in separate required config file) to set up AMD-implementation-independent and environment-independent requirer variable
if (typeof window === 'undefined') {
    // global.define = require('amdefine')(module); // Unfortunately we can't do this to avoid module definition boilerplate as it depends on the specific "module"
    global.requirer = require('requirejs');
    requirer.config({
        paths: {writeBr: 'writeBrNode'}, // Todo: Find some other way to look for environment-specific versions? Might RequireJS provide a way for preference to be given, depending on the environment, to a specific folder (e.g., for Node-specific, SDK-specific, browser-specific, AsYouWish/priv!, etc. versions) and if not found there, to default; without needing to hard-code folder prefixes for each module that config.paths can use to do rerouting. (If not, one could do "envt/" prefix to indicate a module that will vary with the environment, but this asks for more typing.)
        nodeRequire: require // To ensure node module loading relative to this top-level file
    });
}
else {
    window.requirer = requirejs;
}
requirer.config({
    config: {
        shim: {
            pathDepth: 'one',
            baseUrl: '../shims'
        }
    }
});

requirer(['domReady!'], function () {

requirer(['writeBr', 'shim!Array.of', 'shim!Array.prototype.map'], function (writeBr) {
    writeBr('hello world');
    writeBr(Array.of(3, 4, 5));
    writeBr([1, 2, 3].map(function (n) {return n + 5;}));
});

});
