var CACHE_NAME = 'scrumbles-v1.0.3';
var urlsToCache = [
    '/',
    '/css/dest/bootstrap.min.css',
    '/css/dest/main.min.css',
    '/lib/alertify.js/lib/alertify.min.js',
    '/socket.io/socket.io.js',
    '/js/dest/main.min.js',
    'https://fonts.googleapis.com/css?family=Rokkitt',
    'https://fonts.gstatic.com/s/rokkitt/v11/Uu8b3yBtxQPmPTMr0WQ_CA.woff2'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});