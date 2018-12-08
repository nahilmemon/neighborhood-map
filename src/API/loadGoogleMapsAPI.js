// The following code is a slighly modified version of the function taken from:
// https://github.com/ryanwaite28/script-store/blob/master/js/react_resolve_google_maps.js

// This function creates a promise which, when resolved, creates a script which
// loads the Google Maps API and appends it to the end of the document's body
export default function loadGoogleMapsAPI() {
  return new Promise(function(resolve, reject) {
    // Use the following global callback function to resolve the loadGoogleMapsAPI()
    // promise when google maps has finally loaded
    window.resolveGoogleMapsPromise = function() {
      // Resolve the loadGoogleMapsAPI()'s promise by returning the resulting
      // global google object created from calling the API script below
      resolve(window.google);
      // Delete resolveGoogleMapsPromise from the global space once loadGoogleMapsAPI()'s
      // promise has resolved itself
      delete window.resolveGoogleMapsPromise;
    }
    // Create a script tag to load the Google Maps API
    const script = document.createElement("script");
    // developer key
    const API_KEY = 'AIzaSyB9T_T9LeblH4LOdxALGEExB8mRxQ21PcQ';
    // production key
    // const API_KEY = 'AIzaSyBewfjq8ySJBIqlV8NlTRq24smNvaA1tT4';
    // Note: the callback refers to the window.resolveGoogleMapsPromise callback above.
    // Actual initialization of the map and subsequent actions will take place in
    // the React component which uses loadGoogleMapsAPI()
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
    script.async = true;
    script.defer = true;
    script.crossorigin = "anonymous";
    // Add the script tag to the end of document's body. This will subsequently begin
    // loading the Google Maps API.
    document.body.appendChild(script);
  });
}