/*globals require, module*/
(function () {
'use strict';

var through = require('through');

/**
* @param {String} n0 The whole match (NOT IN USE but required by String.prototype.replace)
* @param {String} [initialChars] Any whitespace or semicolon preceding the require statement
* @param {'|"} q The first single or double quote surrounding the required shim module
* @param {String} shimName The name of the shim to be required
* @param {'|"} q2 The second single or double quote surrounding the required shim module (required to be explicit since back-references not apparently supported within the find part of a Node.js RegExp instance)
* @returns {String} The copied whitespace, followed by an inline check for whether the shim exists or not, and if not, it requires the shim
*/
function replacer (n0, initialChars, q, shimName, q2) {
    return initialChars +
        shimName.indexOf('.') !== shimName.lastIndexOf('.') ?
            ('!' + shimName) : // We could build a check for each component
            ('typeof ' + shimName + " !== 'undefined'") +
        ' ? require(' + q + './shims/' + shimName + q2 + ") : ''";
}

/**
* Simple shim for converting require('!shim...') statements
*  into checks for existence of the global and conditional 
*  require-based usage of the shim
* @example `browserify -t shimify main.js > bundle.js`
* @param {string} file File name (NOT IN USE)
* @todo Ensure safe with previous lines a function missing an ending semicolon
* @todo Expand syntax to support all of the RequireJS shim plugin syntax
* @todo Avoid assumption of "./shims/" path! (pass additional config arguments to browserify with -t?)
* @todo Add options to strip require entirely without disturbing line numbers (e.g., to use in browser (or Node) which doesn't need shim code loaded or checked) and option to require without checking (e.g., for IE-only (conditional-comment-loaded) shim file).
*/
module.exports = function (file) {
    var data = '';
    function write (buf) { data += buf; }
    // Upper-case to avoid JSLint strict complaints
    function End () {
        var pattern = "(^|\\s+|;)require\\(([\"'])shim!(.*?)([\"'])\\)\\s*"; // Back-references \\1 apparently not working in Node, so we make the second quote explicit
        this.queue(
            data.replace( // A newline preceded by optional whitespace and some non-whitespace character needs a semicolon added (unless the character is a comma or semi-colon)
                new RegExp(pattern, 'gm'), replacer) //
                // ([^,;\s]\s*\n)   
/*            ).replace(
                new RegExp('(^|;)(' + pattern, 'g'), replacer.bind(null, '')
            )*/
        );
        this.queue(null);
    }
    return through(write, End);
};

}());
