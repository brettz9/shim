/*globals require*/

require.config({
    paths: {
        'shimHelpers': '../shims/shimHelpers'
    },
    config: {
        // Note: We must include this property currently because the shim plugin defaults to looking in a "shims" directory within the baseUrl directory (where the baseUrl directory defaults to the path of the executing HTML file) but we put it at a sister level in this project
        shim: { // IMPORTANT: This "shim" plugin property must be within the "config" property, as distinguished from the "shims" property at the top level for shimming non-AMD modules
            // The following work when the main "shim" is at the root of the web root
            pathDepth: 'one', // Namespaces one folder deep based on first part of file name preceding the first "." (though the default behavior still expects the file to contain the folder name: e.g., require('shim!Array.prototype.map'); would look for "Array/Array.prototype.map.js" relative to any base paths)
            baseUrl: '../shims' // Relative to baseUrl (which defaults to "./" of the executing HTML file or data-main on the script tag if present)
            // baseUrl: '/shim/shims'
            // baseUrl: 'http://127.0.0.1/shim/shims'

            // The following work when the main "shim" is a file URL:
            // baseUrl: '../shims' // Relative to baseUrl (which defaults to "./" of the executing HTML file or data-main on the script tag if present)
            // baseUrl: 'file://d:/wamp/www/shim/shims' // On my system
        }
    }
});
