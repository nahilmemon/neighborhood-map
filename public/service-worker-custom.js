console.log('--This be the custom service worker transpiring..');

/**
 * All of the following code is taken and slight modified from:
 * https://developers.google.com/web/fundamentals/primers/service-workers/
 */

/**
 * URLs/files to cache
 */
const CACHE_NAME = 'hidden-gems-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/asset-manifest.json',
  '/favicon.ico'
];

/**
 * Install the service worker.
 * After the installation phase, open the cache, cache desired files and determine
 * whether the required assets got cached or not.
 */
self.addEventListener('install', function(event) {
  // Wait until the service worker has finished installing before opening and
  // adding the cache.
  event.waitUntil(
    // Open the cache (CACHE_NAME)
    caches.open(CACHE_NAME)
      // Then add the desired urls to cache if they aren't already added
      .then(function(cache) {
        console.log('Opened cache');
        // Add all the urls in URLS_TO_CACHE to CACHE_NAME
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(function(error) {
        console.log('Install/cache adding failed: ', error)
      })
  );
});

/**
 * Respond to a fetch event by first checking if the desired resource is already
 * available in the cache. If not, then make a network request for this resource
 * and add it to the cache afterwards.
 */
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // If the desired resource is already saved in the cache, then
        // return this resource from the cache.
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }

        // Otherwise, obtain this resource by fetching it from the network.
        // To do this, the request needs to be cloned first, since the request
        // is a stream which can only be consumed once. Since we are consuming this
        // once by the cache and again by the browser to fetch now, we need
        // to clone the request first.
        else {
          console.log('Could not find ', event.request.url, ' in cache. Fetching from network now.');
          // Save the url of the event request
          let requestUrl = new URL(event.request.url);

          // Clone the request that needs to be fetched by the browser
          const FETCH_REQUEST = event.request.clone();

          return fetch(FETCH_REQUEST)
            .then(function(response) {
              // Check if the response received is valid
              if(!response) {
                console.log('Error: response is not valid.');
                return response;
              }

              // The response also needs to be cloned since it is also a stream
              // and because we want the browser to consume the response as well
              // as the cache consuming the response. Thus two response streams
              // are needed.
              const RESPONSE_TO_CACHE = response.clone();
              console.log(RESPONSE_TO_CACHE);

              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, RESPONSE_TO_CACHE);
                  console.log('Succeeded to add', RESPONSE_TO_CACHE, 'to cache.')
                })
                .catch(function(error) {
                  console.log('1. Failed to add ', RESPONSE_TO_CACHE, 'to cache because: ', error);
                });

              return response;
            })
            // Catch and log any errors if the above fails
            .catch(function(error) {
              console.log('2. Failed to add ', FETCH_REQUEST, 'to cache because: ', error);
              // If the fetch failed to find a restaurant info page because the
              // user is offline, then display a skeleton page instead
              if (requestUrl.origin === location.origin) {
                if (requestUrl.pathname.startsWith('/restaurant.html')) {
                  return caches.match('/skeleton.html');
                }
              }
            });
        }
      })
  );
});

/**
 * When a new service worker has activated, delete all the previous cache versions.
 */
self.addEventListener('activate', function(event) {
  const CAHCE_WHITELIST = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CAHCE_WHITELIST.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/**
 * When the service worker receives the 'skipWaiting' message,
 * trigger the service worker to update and activate immediately.
 */
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  } else {
    console.log(event.data);
  }
});