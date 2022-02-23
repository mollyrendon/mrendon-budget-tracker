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
This piece of code is a function that will run when the user activates their app.  It will first get all of the cache keys and then filter them to find only those that have APP_PREFIX in it's indexOf() method.  After filtering out the cache keys
they are pushed into an array and returned as a promise.  The code deletes any cache key with APP_PREFIX in its indexOf() method from the caches.  
*/
self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log("deleting cache : " + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});


/*Fetch:
This piece of code is a function that is used to fetch a file from the server.  It first checks to see if the file is cached on the local machine.  If it is then the code will return that cached version of the 
file and not make any request to the server.  
*/

self.addEventListener("fetch", function (e) {
    console.log("fetch request : " + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log("responding with cache : " + e.request.url);
                return request;
            } else {
                console.log("file is not cached, fetching : " + e.request.url);
                return fetch(e.request);
            }
        })
    );
});