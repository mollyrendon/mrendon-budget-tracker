/*Constant Definitions:
The APP_PREFIX constant is where the app will be installed to on the device.  The VERSION constant is used to determine whether or not there has been an update.  The CACHE_NAME constant is used to determine what files
should be cached and how they should be stored locally.  
*/

const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js",
    "./manifest.json",
    "./icons/icon-512x512.png",
    "./icons/icon-384x384.png",
    "./icons/icon-192x192.png",
    "./icons/icon-152x152.png",
    "./icons/icon-144x144.png",
    "./icons/icon-128x128.png",
    "./icons/icon-96x96.png",
    "./icons/icon-72x72.png"
];


/*Install:
This piece of code waits for the cache to be installed before continuing.  When it is done installing it will add all of the files in FILES_TO to the cache.  
*/
self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("installing cache : " + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});


/*Activate:

*/


/*Fetch:

*/