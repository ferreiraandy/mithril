cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-sqlite-legacy/www/SQLitePlugin.js",
        "id": "cordova-sqlite-legacy.SQLitePlugin",
        "pluginId": "cordova-sqlite-legacy",
        "clobbers": [
            "SQLitePlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "cordova-sqlite-legacy": "0.7.17"
}
// BOTTOM OF METADATA
});