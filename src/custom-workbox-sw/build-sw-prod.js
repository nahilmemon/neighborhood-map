// Note: this version creates a service worker for the final
// build directory for production mode
// Import workbox-build
const workboxBuild = require('workbox-build');

// Note: This function is designed to run after all assets and whatnot
// have been built. This function will also return a promise.
// Using workbox-build, copy the source service worker file, create a
// list of files to precache (based on the glob directory and glob
// patterns), and inject this resulting precache manifest into the
// newly copied service worker file.
const buildSWProdMode = () => {
  // The location of the service worker file that I wrote
  let serviceWorkerSourceLocation = 'src/custom-workbox-sw/sw.js';
  // Where to place the modified copy of my service worker file
  let serviceWorkerDestinationLocation = 'build/sw.js';
  // Create the new service worker file with the list of files
  // to precache injected into it
  return workboxBuild.injectManifest({
    swSrc: serviceWorkerSourceLocation,
    swDest: serviceWorkerDestinationLocation,
    globDirectory: 'build',
    globPatterns: [
      '**\/*.{js,css,html,png,svg,gif}',
    ]
  })
  // Then log any resulting warnings created during the above
  // process as well as information about the new service worker
  // file and the precache manifest.
  .then(({count, size, warnings}) => {
    warnings.forEach(console.warn);
    console.log(`
      A service worker has been generated in ${serviceWorkerDestinationLocation}
      based off of the service worker located in ${serviceWorkerSourceLocation}.
      A total of ${count} files will be precached.
      This will require ${size/1024/1024} MB storage space.
    `);
  });
}

// Perform the service worker build operation
buildSWProdMode();