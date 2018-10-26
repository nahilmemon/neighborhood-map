const API = 'https://api.foursquare.com/v2';

const CLIENT_ID = 'A54UP4TD2KHDSEXPGJPMOSQLD02AS2L0LWS1MKDYPLZWKTVW';
const CLIENT_SECRET = 'JWKH4PIPY3VRV2MBFQPSF3E230F0PRXNCXMZ544XW5Q34RLJ';
const VERSION = '20181025';

const API_KEYS = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERSION}`;

const HEADERS = {
  'Accept': 'application/json'
}

// Take an object full of search parameters and convert into the syntax
// that the Foursquare Places API requires when making a request to them
function determineURLEnding(parameters) {
  if (!parameters) {
    return '';
  } else {
    return Object.entries(parameters)
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join('&');
  }
}

// Basic template for making a fetch request
// endpoint refers to any of the API endpoints detailed in the Foursquare Places API
// method can be 'GET' or 'POST'
// parameters refers to an object detailing the specifics of the desired request
function basicFetchTemplate(endpoint, method, parameters) {
  const REQUEST_SETTINGS = {
    method: method,
    headers: HEADERS
  }
  const URL_ENDING = determineURLEnding(parameters);
  const RESOURCE_TO_FETCH = `${API}${endpoint}?${API_KEYS}&${URL_ENDING}`;
  return fetch(RESOURCE_TO_FETCH, REQUEST_SETTINGS)
    .then(results => results.json())
}

// Actual request specifics using the Foursquare API

// Search for venues
export function searchForVenues(parameters) {
  return basicFetchTemplate('/venues/search', 'GET', parameters);
}

// Get details about a specific venue
export function getVenueDetails(venueId) {
  return basicFetchTemplate(`/venues/${venueId}`, 'GET');
}

// Get photos from a specific venue
export function getVenuePhotos(venueId) {
  return basicFetchTemplate(`/venues/${venueId}/photos`, 'GET');
}

// Get tips from a speicific venue
export function getVenueTips(venueId) {
  return basicFetchTemplate(`/venues/${venueId}/tips`, 'GET');
}