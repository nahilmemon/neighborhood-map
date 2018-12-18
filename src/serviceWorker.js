// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read http://bit.ly/CRA-PWA.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  console.log('--Let\'s create a service worker.');
  // if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  if ('serviceWorker' in navigator) {
    console.log('--We\'re creating a service worker even if it\'s dev mode.');
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      // This is Create React App's automatically generated service worker
      // file's location
      // const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      // This is my own custom service worker file's location
      // const swUrl = `${process.env.PUBLIC_URL}/service-worker-custom.js`;
      // This is my own custom service worker file's location using workbox
      // This is the same for both production and development modes
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still
        // exists or not before attempting to register the service worker
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit http://bit.ly/CRA-PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      // Case 1: There is no service worker currently controlling this page.
      // This means that the user is already currently viewing the latest
      // version of this webpage, so exit this promise immediately.
      if (!navigator.serviceWorker.controller) {
        return;
      }

      // Case 2: There's an updated service worker already waiting.
      // Respond by triggering the update notification to show to the user.
      if (registration.waiting) {
        updateReady(registration.waiting);
        return;
      }

      // Case 3: There's an updated service worker currently installing.
      // Respond by tracking its progress and listening for its state changes.
      // When the service worker finishes installing (i.e. when its state
      // becomes 'installed'), then trigger the update notification to show to the
      // user.
      if (registration.installing) {
        trackInstalling(registration.installing);
        return;
      }

      // Case 4: There are no currently installing service workers.
      // Listen for new installing service workers to arrive.
      // If one arrives, track its progress.
      // If it becomes 'installed', call updateReady()
      registration.addEventListener('updatefound', function() {
        trackInstalling(registration.installing);
      });

      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);

    /*
       // CRA code to check for updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        // Case 1 maybe?
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('\n\t====== Case 7: CRA detects a service worker update available. ======\n');
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See http://bit.ly/CRA-PWA.'
              );

              updateReady(registration.waiting);

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Case 6
              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    //*/
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });

  // If the service worker has registered successfully, then show various
  // notifications according to the state of the webpage and the caches
  navigator.serviceWorker.ready
    .then(function(registration) {
      // Notification 1: Currently offline mode
      // Show the currently offline mode notification if the user is offline
      window.addEventListener('offline', (event) => {
        displayCurrentlyOfflineModeNotification();
        // Also hide the update notification if it's also open.
        hideUpdateNotificationHTML();
      });
      // Hide the currently offline mode notification if the user is back online
      window.addEventListener('online', (event) => {
        deleteCurrentlyOfflineModeNotification();
        // Also show the update notification if it's also open.
        showUpdateNotificationHTML();
      });

      // Notification 2: Offline ready mode
      // If the browser has local storage enabled and working properly,
      // then only show the notification for the first time that the service
      // worker has been activated and runtime caching has begun.
      if (isLocalStorageAvailable()) {
        if(!localStorage.getItem('offlineReadyNotificationShownBefore')) {
          caches.keys().then(function(cacheNames) {
            // Runtime caching has begun if there's more than two caches present
            // (the other two caches belong to the precaching caches).
            if (cacheNames.length > 2) {
              // Update the local storage to remember that the notification
              // has already been shown before and not to show it again.
              localStorage.setItem('offlineReadyNotificationShownBefore', true);
              // Display the offline mode ready notification.
              displayOfflineReadyNotification();
            }
          });
        }
      }
      // Otherwise, if local storage is unavailable, then always show the
      // notification when the user has refreshed the page (after runtime
      // caching has been enabled).
      else {
        caches.keys().then(function(cacheNames) {
          if (cacheNames.length > 2) {
            displayOfflineReadyNotification();
          }
        });
      }

      // Notification 3: Update ready
      // Case 5: service worker's .skipWaiting() was called, meaning
      // the service worker controlling the page has changed.
      // Respond to this by reloading the page to let it effectively
      // take control of the page and update its contents accordingly.
      // Ensure refresh is only called once.
      // This works around a bug in "force update on reload" in dev
      // tools to avoid infinitely reloading the page.
      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange',
        function() {
          if (refreshing) {
            return;
          }
          refreshing = true;
          window.location.reload();
        }
      );
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType !== null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}

/**
 * Determine if local storage is available and in a usable state.
 */
function isLocalStorageAvailable() {
  // If it is possible to set and remove an item in the local storage
  // without throwing any errors, then local storage is available
  try {
    let testItem = 'testItem';
    localStorage.setItem(testItem, testItem);
    localStorage.removeItem(testItem);
    return true;
  }
  // Otherwise, if an error is thrown, regardless of whether it's
  // because local storage is available or if there's a lack of
  // storage space, then return false anyhow since the local
  // storage won't be in a usable state
  catch(event) {
    return false;
  }
}

/**
 * Track the installation progress of a currently installing service worker.
 * When the service worker finishes installing (i.e. when its state becomes
 * 'installed'), then trigger the update notification to show to the user.
 */
function trackInstalling(worker) {
  worker.addEventListener('statechange', function() {
    if (worker.state === 'installed') {
      updateReady(worker);
    }
  });
}

/**
 * Display a notification to the user to update the webpage.
 * Refresh button will update the service worker and reload the webpage.
 * Dismiss will hide the notification.
 */
function updateReady(worker) {
  // Create the update notification section to display on the webpage
  createUpdateNotificationHTML();

  const UPDATE_SECTION = document.getElementById('update-site-notification');
  UPDATE_SECTION.addEventListener('click', function(event) {
    // If the user hits the update button, then tell the service worker to
    // update immediately (and then refresh the page)
    if (event.target.classList.contains('update-button')) {
      // Delete the update notification html
      deleteHTML(UPDATE_SECTION);
      // Tell the service worker to update immediately (and then refresh the page)
      worker.postMessage({
        action: 'skipWaiting'
      });
    }
    // Otherwise, if the user clicks the dismiss button, then delete the update
    // notification html
    else if (event.target.classList.contains('dismiss-button')) {
      deleteHTML(UPDATE_SECTION);
      return;
    }
  });
}

/**
 * Create the section that displays the update notification.
 */
function createUpdateNotificationHTML() {
  let updateSection = document.createElement('section');
  updateSection.id = 'update-site-notification';
  updateSection.classList.add('service-worker-notification');

  let updateDiv = document.createElement('div');

  let updateTextP = document.createElement('p');
  updateTextP.innerText = 'New version available';

  let updateButton = document.createElement('button');
  updateButton.innerText = 'Update';
  updateButton.classList.add('update-button');

  let dismissButton = document.createElement('button');
  dismissButton.innerText = 'Dismiss';
  dismissButton.classList.add('dismiss-button');

  updateDiv.append(updateButton);
  updateDiv.append(dismissButton);

  updateSection.append(updateTextP);
  updateSection.append(updateDiv);

  let firstDOMElement = document.querySelector('#root');
  document.body.insertBefore(updateSection, firstDOMElement);
}

/**
 * Hide update notification html if it already exists.
 */
function hideUpdateNotificationHTML() {
  const UPDATE_SECTION = document.getElementById('update-site-notification');
  if (UPDATE_SECTION) {
    UPDATE_SECTION.classList.add('hide');
  }
}

/**
 * Show update notification html if it already exists.
 */
function showUpdateNotificationHTML() {
  const UPDATE_SECTION = document.getElementById('update-site-notification');
  if (UPDATE_SECTION) {
    UPDATE_SECTION.classList.remove('hide');
  }
}

/**
 * Create the section that displays the currently offline notification.
 */
function createCurrentlyOfflineModeNotificationHTML() {
  let currentlyOfflineModeSection = document.createElement('section');
  currentlyOfflineModeSection.id = 'currently-offline-notification';
  currentlyOfflineModeSection.classList.add('service-worker-notification');

  let offlineMessage = document.createElement('p');
  offlineMessage.innerText = 'Currently offline. Map functionality may be limited.';

  let dismissButton = document.createElement('button');
  dismissButton.innerText = 'Dismiss';
  dismissButton.classList.add('dismiss-button');

  currentlyOfflineModeSection.append(offlineMessage);
  currentlyOfflineModeSection.append(dismissButton);

  let firstDOMElement = document.querySelector('#root');
  document.body.insertBefore(currentlyOfflineModeSection, firstDOMElement);
}

/**
 * Display a notification to the user that he/she is currently offline.
 * Dismiss will hide the notification.
 * Automatically hide the notification after a certain amount of time.
 */
function displayCurrentlyOfflineModeNotification() {
  // Create the currently offline mode notification section to display
  // on the webpage.
  createCurrentlyOfflineModeNotificationHTML();

  const OFFLINE_MODE_SECTION = document.getElementById('currently-offline-notification');
  // If the user clicks the dismiss button, then delete the offline mode
  // notification html.
  OFFLINE_MODE_SECTION.addEventListener('click', function(event) {
    if (event.target.classList.contains('dismiss-button')) {
      deleteHTML(OFFLINE_MODE_SECTION);
      return;
    }
  });
}

/**
 * Delete currently offline mode notification html.
 */
function deleteCurrentlyOfflineModeNotification() {
  const OFFLINE_MODE_SECTION = document.getElementById('currently-offline-notification');
  if (OFFLINE_MODE_SECTION) {
    deleteHTML(OFFLINE_MODE_SECTION);
  }
}

/**
 * Create the section that displays the offline ready notification.
 */
function createOfflineReadyNotificationHTML() {
  let offlineReadySection = document.createElement('section');
  offlineReadySection.id = 'offline-ready-notification';
  offlineReadySection.classList.add('service-worker-notification');

  let offlineReadyMessage = document.createElement('p');
  offlineReadyMessage.innerText = 'This site can work offline (map functionality may be limited).';

  let dismissButton = document.createElement('button');
  dismissButton.innerText = 'Dismiss';
  dismissButton.classList.add('dismiss-button');

  offlineReadySection.append(offlineReadyMessage);
  offlineReadySection.append(dismissButton);

  let firstDOMElement = document.querySelector('#root');
  document.body.insertBefore(offlineReadySection, firstDOMElement);
}

/**
 * Display a notification to the user that he/she is currently offline.
 * Dismiss will hide the notification.
 * Automatically hide the notification after a certain amount of time.
 */
function displayOfflineReadyNotification() {
  // Create the offline ready notification section to display
  // on the webpage.
  createOfflineReadyNotificationHTML();

  const OFFLINE_READY_SECTION = document.getElementById('offline-ready-notification');
  // If the user clicks the dismiss button, then delete the offline ready
  // notification html.
  OFFLINE_READY_SECTION.addEventListener('click', function(event) {
    if (event.target.classList.contains('dismiss-button')) {
      deleteHTML(OFFLINE_READY_SECTION);
      return;
    }
  });
  // Delete the offline ready notification html automatically after 10 sec.
  setTimeout(() => {
    const OFFLINE_READY_SECTION = document.getElementById('offline-ready-notification');
    if (OFFLINE_READY_SECTION) {
      deleteHTML(OFFLINE_READY_SECTION);
    }
  }, 10000);
}

/**
 * Delete the given element's html.
 */
function deleteHTML(element) {
  element.parentNode.removeChild(element);
}