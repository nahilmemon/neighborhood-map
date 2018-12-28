// React
import React, { Component } from 'react';
// Packages
import PropTypes from 'prop-types';
import axios from 'axios';
import axiosCancel from 'axios-cancel';
// Styling
import { mapStyles } from '../mapStyles.js';
// API helpers
import loadGoogleMapsAPI from '../API/loadGoogleMapsAPI.js';
import defineCustomMapMarkerClass from '../API/defineCustomMapMarkerClass.js';
import defineCustomInfoWindowClass from '../API/defineCustomInfoWindowClass.js';
// Images
import loadingGif from '../icons/loading.gif';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: false
    };
  }

  static propTypes = {
    locationsData: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterByNameText: PropTypes.string.isRequired,
    filterByCategoryOption: PropTypes.string.isRequired,
    filterLocations: PropTypes.func.isRequired,
    currentlyFocusedLocationId: PropTypes.oneOfType([
        PropTypes.number,
        function(props, propName, componentName) {
          if (/!null/.test(props[propName])) {
            return new Error(
              `${componentName}'s prop: ${propName} has invalid value of ${props[propName]}.`
              + ` Value should equal null.`
            );
          }
        }
      ]),
    onActiveMarkerChange: PropTypes.func.isRequired,
    isFoursquareDataLoaded: PropTypes.bool.isRequired,
    foursquareInfoRetrievalErrorOccurred: PropTypes.bool.isRequired,
    onMapLoadedEvent: PropTypes.func.isRequired,
    isMapLoaded: PropTypes.bool.isRequired
  }

  componentDidMount() {
    // Add the cancel prototype method from axios-cancel onto axios
    axiosCancel(axios, {
      debug: false
    });

    // Load Google Maps API
    loadGoogleMapsAPI()
      // After all the necessary data has been loaded,
      // create and display the map
      .then((promiseResults) => {
        // Save the promises' results
        this.google = promiseResults;

        this.filteredMarkers = [];

        // Create the map
        this.createMap(this.google);

        // Create the custom marker and infoWindow classes to be able to make
        // and manipulate custom markers and infoWindows
        this.CustomMapMarkerClass = defineCustomMapMarkerClass();
        this.CustomInfoWindowClass = defineCustomInfoWindowClass();

        // Create the infoWindow
        this.createInfoWindow(this.google, this.map);
        // Create and display the markers
        this.createAllMarkers(this.google, this.map, this.props.locationsData);
        // If information from the Foursquare API has already been loaded by now,
        // then update the markers with the newly retrieved information
        if (this.props.isFoursquareDataLoaded) {
          this.modifyMarkersWithNewData(this.markers, this.props.locationsData);
        }
        // Reposition the map to fit all the markers
        this.displayGivenMarkers(this.google, this.map, this.markers);

        // Hide any off screen markers from keyboard users (and everyone else too)
        this.filteredMarkers = this.markers;
        this.hideOffScreenMarkers(this.map, this.filteredMarkers);

        // Remove the loading gif off of the map. Note that the map is still actually
        // loading its tiles and whatnot.
        this.setState({
          isLoaded: true
        });
      })
      .catch((error) => {
        console.log('Error loading google maps in map container', error);
        this.setState({
          error: true
        });
      });
  }

  componentWillUnmount() {
    // Cancel all currently active fetch requests
    axios.cancelAll();
  }

  componentDidUpdate(prevProps) {
    // If the user has changed any of the inputs in the filter section
    // of the side bar component, then update the markers so that only
    // the markers matching the filtration results are visible. Also
    // close the infoWindow and unfocus the currently focused marker and
    // corresponding list item in the side bar if this marker/li is no
    // longer a part of the visible markers/li.
    if (this.props.filterByNameText !== prevProps.filterByNameText ||
      this.props.filterByCategoryOption !== prevProps.filterByCategoryOption) {
      // Only display the filtered location markers
      this.displayFilteredMarkers(this.google, this.map, this.markers, this.infoWindow);
    }

    // If the currently focused location has changed, then update the markers
    // so that the corresponding marker is now focused and the infoWindow
    // opens with information about this marker or so that the previously
    // focused marker is no longer focused and the infoWindow is closed.
    if (this.props.currentlyFocusedLocationId !== prevProps.currentlyFocusedLocationId) {
      // If the user has clicked on a list item in the side bar component,
      // then focus the corresponding marker and display an infoWindow about it
      if (this.markers) {
        this.focusMarkerOfCurrentlyFocusedLocation(this.map, this.infoWindow, this.props.currentlyFocusedLocationId, this.markers);
      }
    }

    // If information from the Foursquare API has been loaded, then update the
    // markers with the newly retrieved information (if the Google API has
    // already finished loading and the markers have already been created)
    if (this.props.isFoursquareDataLoaded !== prevProps.isFoursquareDataLoaded) {
      if (this.markers) {
        this.modifyMarkersWithNewData(this.markers, this.props.locationsData);
      }
    }
  }

  // Tell the parent component(s) that the map, its markers, and the info window
  // have fully loaded
  handleMapLoadedEvent = (isMapLoaded) => {
    this.props.onMapLoadedEvent(isMapLoaded);
  }

  // When the active marker needs to change, then alter the appearance of
  // the marker accordingly and call the parent component's
  // onActiveMarkerChange function
  onActiveMarkerChange = (marker, id) => {
    if (id !== null) {
      marker.setFocusedAppearance();
      marker.hasOpenInfoWindow = true;
      marker.show();
    } else {
      marker.setBlurredAppearance();
      marker.hasOpenInfoWindow = false;
    }
    this.props.onActiveMarkerChange(id);
  }

  // Hide the marker if it's not visible on the current map display (this
  // will hide the marker from viewers, keyboard users and screen readers).
  // Hiding the marker from keyboard users is important so that they cannot
  // tab onto these markers since tabbing onto an off screen marker causes
  // the mapDiv to scroll automatically which shifts the controls of the
  // map and sometimes breaks the map.
  hideOffScreenMarkers = (map, markers) => {
    let boundaries = map.getBounds();
    markers.forEach((marker) => {
      if ((boundaries && boundaries.contains(marker.position)) ||
        // Don't hide the marker if an open info window is attached to it
        marker.hasOpenInfoWindow === true) {
        marker.show();
      } else {
        marker.hide();
      }
    });
  }

  // Create map instance
  createMap = (google) => {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 24.5172938, lng: 54.370662},
      zoom: 13,
      styles: mapStyles,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
      },
      gestureHandling: 'cooperative'
    });

    // Whenever the map is moved around, figure out which markers are off
    // screen and hide them and show the remaining on screen markers
    this.map.addListener('bounds_changed', () => {
      this.hideOffScreenMarkers(this.map, this.filteredMarkers);
    });

    // Figure out the first time that the map has become idle.
    // Note: at this point, the custom map markers and custom info window have
    // definitely loaded, but the tiles and controls tend not to have loaded yet.
    // I'm using the idle event instead of the tilesloaded event since I only
    // need to know when I can start using the map markers and the info window.
    this.google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.handleMapLoadedEvent(true);
    });
  }

  // Create the list of markers based on the locationsData
  createAllMarkers = (google, map, locations) => {
    this.markers = locations.map((location, index) => {
      let marker = new this.CustomMapMarkerClass({
        map: map,
        position: location.location,
        visible: true,
        title: location.name,
        name: location.name,
        id: location.id,
        description: location.description,
        descriptionLink: location.descriptionLink,
        category: location.category,
        foursquareVenueID: location.foursquareVenueID,
        photo: location.photo,
        formattedAddress: location.formattedAddress
      });

      // Add an event listener so that when a marker is clicked,
      // an infoWindow describing the marker's properties will display
      marker.addListener('click', () => {
        this.populateInfoWindow(this.map, marker, this.infoWindow);
        // Also make the corresponding list item in the side bar active
        this.onActiveMarkerChange(marker, marker.id);
      });

      return marker;
    });
  }

  // Modify markers with information obtained from the Foursquare API
  modifyMarkersWithNewData = (markers, locationsData) => {
    let unsearchedLocations = [...locationsData];
    markers.forEach(marker => {
      // If the marker's location has information on Foursquare,
      // then update the marker's photo and formatted address with
      // the information available on Foursquare (otherwise, the default
      // is that these attributes are set to null)
      if (marker.foursquareVenueID !== null) {
        // Figure out which location matches with the current marker
        // First find the id of the matching location in the array of
        // unsearched locations
        let matchingLocationId = unsearchedLocations.findIndex(location => {
          return location.foursquareVenueID === marker.foursquareVenueID;
        });
        // Then find the matching location using the id found above (if
        // an id was actually found)
        let matchingLocation;
        if (matchingLocationId !== undefined && matchingLocationId !== -1) {
          matchingLocation = unsearchedLocations[matchingLocationId];
          // Remove the matching location from the unsearchedLocations
          // so that the next searches are faster (as the array becomes
          // smaller)
          unsearchedLocations.splice(matchingLocationId, 1);
        }
        // If there was a match, then update the marker's photo
        // and formatted address with the matching locations's info
        if (matchingLocation) {
          // Update the marker's photo attribute
          marker.photo = matchingLocation.photo;
          // Update the marker's formatted address attribute
          marker.formattedAddress = matchingLocation.formattedAddress;
        }
      }
    });
  }

  // Display given markers, where the map is repositioned to fit all
  // the given markers on screen
  displayGivenMarkers = (google, map, markers) => {
    // To store the map's boundaries
    let mapBoundaries = new google.maps.LatLngBounds();
    // For each marker, display the marker and extend the map's boundaries
    // in order to include this marker in the visible area on screen
    markers.forEach((marker) => {
      marker.show();
      mapBoundaries.extend(marker.position);
    });
    // Before repositioning the map, add an event listener for when the map
    // bounds have changed. If so, then ensure that the map isn't zoomed out
    // too much (happens in MS Edge where the zoom level becomes 0 after
    // map.fitbound(mapBoundaries) is called).
    google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
      if (map.getZoom() < 9) {
        map.setZoom(9);
      }
    });
    // Reposition the map to display all the markers on screen
    map.fitBounds(mapBoundaries);
  }

  // Hide given markers
  hideGivenMarkers = (google, map, markers) => {
    markers.forEach((marker) => {
      marker.hide();
    });
  }

  // Create the info window to display information about a selected place
  createInfoWindow = (google, map) => {
    // Create a new, empty info window
    this.infoWindow = new this.CustomInfoWindowClass({
      position: null,
      title: '',
      content: null,
      map: map
    });

    // Add an event listener to clear the infoWindow's marker when
    // the close button is clicked
    this.infoWindow.addListener('closeclick', (event) => {
      // Reset the style of the infoWindow's current marker
      if (this.infoWindow.marker !== undefined && this.infoWindow.marker !== null) {
        this.infoWindow.marker.setBlurredAppearance();
        this.infoWindow.marker.focusMarkerButtonNode();
        this.infoWindow.marker.hasOpenInfoWindow = false;
      }
      // Update the side bar so that this marker's corresponding list
      // item is no longer active
      this.props.onActiveMarkerChange(this.infoWindow.marker, null);
      // Remove the marker from the infoWindow
      this.infoWindow.marker = null;
      this.infoWindow.hide();
    });

    this.infoWindow.setMap(this.map);
  }

  // Populate the infoWindow with information regarding the given marker.
  // Note: this is set to only display one infoWindow on screen at a time.
  populateInfoWindow = (map, givenMarker, infoWindow) => {
    // Populate the infoWindow if the given marker is different from the
    // infoWindow's current marker
    if (infoWindow.marker !== givenMarker) {
      // Reset the style of the infoWindow's previous marker
      if (infoWindow.marker !== undefined && infoWindow.marker !== null) {
        infoWindow.marker.setBlurredAppearance();
        infoWindow.marker.hasOpenInfoWindow = false;
      }

      // Change the style of the given marker
      givenMarker.setFocusedAppearance();

      // Set the infoWindow's marker to the given marker
      infoWindow.marker = givenMarker;
      infoWindow.marker.hasOpenInfoWindow = true;

      // Determine the contents of the info window
      // The info window should at least display the marker's
      // description
      let contentHTMLString = `<p class="info-window-description">
          "${givenMarker.description}"
          (<a href="${givenMarker.descriptionLink}">Source</a>)
        </p>`;
      // If there was an error in getting more information from
      // the Foursquare API, then let the user know within the
      // info window
      if (this.props.foursquareInfoRetrievalErrorOccurred) {
        contentHTMLString += '<p class="api-error-message">Error loading extra, external data from Foursquare. Please try refreshing the page to try again.</p>';
      }
      // Otherwise, if the information is still being retrieved,
      // then display a loading message
      else if (!this.props.isFoursquareDataLoaded) {
        contentHTMLString += '<p class="api-error-message">Loading extra, external data from Foursquare. Please wait.</p>';
      }
      // Otherwise, if information was successfully retrieved from
      // the Foursquare API, then add this information to the
      // info window contents
      else {
        // If the given marker has a formatted address, then add
        // this to the info window contents
        if (givenMarker.formattedAddress !== null) {
          contentHTMLString += '<h5 class="address-heading">Address</h5>';
          for (let i=0; i<givenMarker.formattedAddress.length-1; i++) {
            contentHTMLString += `<p class="address-line">${givenMarker.formattedAddress[i]},</p>`;
          }
          contentHTMLString += `<p class="address-line">${givenMarker.formattedAddress[givenMarker.formattedAddress.length - 1]}</p>`;
        }

        // If the given marker has a photo, then add this to the
        // info window contents using the picture element and
        // srcset and sizes attributes in order to display the
        // photo responsively
        if (givenMarker.photo !== null) {
          // Array of possible image sizes to display on devices of
          // various sizes and various device pixel ratios
          let possibleImageSizes = [268, 400, 500, 600, 800, 1000, 1200, 1500, 1800];
          // To store the srcset attribute. The first size should
          // theoretically be available on Foursquare
          let srcsetString = `${givenMarker.photo.prefix}width${possibleImageSizes[0]}${givenMarker.photo.suffix} ${possibleImageSizes[0]}w, `;
          // For the remaining sizes, first check if the photo
          // available on Foursquare is large enough compared to
          // the size desired in the possibleImageSizes array
          // before adding it to the srcsetString
          for (let i=1; i<possibleImageSizes.length-1; i++) {
            if (givenMarker.photo.width >= possibleImageSizes[i]) {
              srcsetString += `${givenMarker.photo.prefix}width${possibleImageSizes[i]}${givenMarker.photo.suffix} ${possibleImageSizes[i]}w, `;
            }
          }
          // The last item shouldn't have a comma at the end,
          // hence its outside the for loop
          if (givenMarker.photo.width >= possibleImageSizes[possibleImageSizes.length - 1]) {
            srcsetString += `${givenMarker.photo.prefix}width${possibleImageSizes[possibleImageSizes.length - 1]}${givenMarker.photo.suffix} ${possibleImageSizes[possibleImageSizes.length - 1]}w`;
          }

          // Build and add the html to display the photo responsively
          // where the default size is 600px in case the browser
          // does not support the <source> element
          contentHTMLString += `<picture>
              <source
                srcset="${srcsetString}"
                sizes="
                  (max-width: 430px) calc(300px - 2*16px),
                  (max-width: 600px) calc(100vw - 2*(40px + 25px) - 2*16px),
                  (max-width: 730px) calc(300px - 2*16px),
                  (max-width: 1000px) calc(100vw - 300px - 2*(40px + 25px) - 2*16px),
                  (min-width: 1001px) calc(630px - 2*16px)"
              />
              <img
                class="info-window-image"
                src="${givenMarker.photo.prefix}width600${givenMarker.photo.suffix}"
                alt=""
              />
            </picture>`;
        }
      }

      // Set the contents of the info window
      infoWindow.setContent(givenMarker.name, contentHTMLString);

      // Open and display the infoWindow
      infoWindow.setPosition(givenMarker.position);
      infoWindow.show();
    }
  }

  // Only display the markers that match the filtered locations based on
  // the user-selected inputs in the SideBar component
  displayFilteredMarkers = (google, map, markers, infoWindow) => {
    if (markers) {
      // Hide all markers
      this.hideGivenMarkers(google, map, markers);
      // Figure out which markers remain after filtration
      let filteredMarkers = this.props.filterLocations(markers, this.props.filterByNameText, this.props.filterByCategoryOption);
      // If there are markers in the filtered results, then only display them
      if (filteredMarkers.length > 0) {
        this.displayGivenMarkers(google, map, filteredMarkers);
      }
      this.filteredMarkers = filteredMarkers;
      // Close the infoWindow if it's already been created and the
      // related marker is no longer visiible after filtration
      if (infoWindow && infoWindow.marker && infoWindow.marker.visible === false) {
        infoWindow.marker.hasOpenInfoWindow = false;
        infoWindow.hide();
        this.onActiveMarkerChange(infoWindow.marker, null);
        infoWindow.marker = null;
      }
    }
  }

  // If the user clicks on a list item in the side bar component, then
  // focus the corresponding marker and open an info window there about it
  focusMarkerOfCurrentlyFocusedLocation = (map, infoWindow, currentlyFocusedLocationId, markers) => {
    // Find the marker to focus
    let markerToFocus = markers.filter((marker) => {
      return marker.id === currentlyFocusedLocationId
    });
    // If a result was found (i.e. if currentlyFocusedLocationId !== null),
    // then focus the corresponding marker and populate the infoWindow
    if (markerToFocus.length > 0) {
      markerToFocus = markerToFocus[0];
      // Change the icon color of this marker
      markerToFocus.setFocusedAppearance();
      // Populate the infoWindow with this marker's info and display the
      // infoWindow
      this.populateInfoWindow(map, markerToFocus, infoWindow);
    }
  }

  render() {
    if (this.state.error === true) {
      return (
        <section className="map-container error-mode">
          <p className="error-message">Error in loading Google Maps. Please check your internet connection.</p>
        </section>
      );
    }
    else if (this.state.isLoaded === false) {
      // Note: this loading gif was taken from:
      // https://www.behance.net/gallery/31234507/Open-source-Loading-GIF-Icons-Vol-1
      return (
        <section className="map-container loading-mode">
          <map
            id="map"
            className="map hide-map"
            name="map"
            role="application"
          ></map>
          <img
            className="loading-gif"
            src={loadingGif}
            alt="Loading Google Maps..." />
        </section>
      );
    } else {
      // Add an aria-label to the map's focusable div created by the Google
      // Maps API
      let focusableMapDiv = document.getElementById('map').querySelector('div[tabindex="0"]');
      if (focusableMapDiv) {
        focusableMapDiv.setAttribute('aria-label', 'Map showing the locations of some hidden gems in Abu Dhabi, UAE.');
      }
      return (
        <section className="map-container">
          <map
            id="map"
            className="map"
            name="map"
            role="application"
          ></map>
        </section>
      );
    }
  }
}

export default MapContainer;