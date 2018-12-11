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
 * Track the installation progress of a currently installing service worker.
 * When the service worker finishes installing (i.e. when its state becomes
 * 'installed'), then trigger the update notification to show to the user.
 */
function trackInstalling(worker) {
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      updateReady(worker);
    }
  });
};

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
};

/**
 * Create the section that displays the update notification
 */
function createUpdateNotificationHTML() {
  let updateSection = document.createElement('section');
  updateSection.id = 'update-site-notification';

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
 * Delete the update notification section
 */
function deleteHTML(element) {
  element.parentNode.removeChild(element);
}