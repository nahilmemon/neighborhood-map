// React
import React, { Component } from 'react';
// Packages
import axios from 'axios';
import axiosCancel from 'axios-cancel';
// Styling
import { mapStyles } from '../mapStyles.js';
// API helpers
// import * as FoursquareAPI from '../API/FoursquareAPI.js';
import loadGoogleMapsAPI from '../API/loadGoogleMapsAPI.js';
import defineCustomMapMarkerClass from '../API/defineCustomMapMarkerClass.js';
import defineCustomInfoWindowClass from '../API/defineCustomInfoWindowClass.js';

class MapContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Add the cancel prototype method from axios-cancel onto axios
    axiosCancel(axios, {
      debug: false
    });

    // Load Google Maps API
    let loadGoogleMapsAPIPromise = loadGoogleMapsAPI();

    // After all the necessary data has been loaded,
    // create and display the map
    Promise.all([
      loadGoogleMapsAPIPromise
    ])
    .then((promiseResults) => {
      // Save the promises' results
      this.google = promiseResults[0];

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
      // Reposition the map to fit all the markers
      this.displayGivenMarkers(this.google, this.map, this.markers);

      // Hide any off screen markers from keyboard users (and everyone else too)
      this.filteredMarkers = this.markers;
      this.hideOffScreenMarkers(this.map, this.filteredMarkers);
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
  }

  // When the active marker needs to change, then alter the appearance of
  // the marker accordingly and call the parent component's
  // onActiveMarkerChange function
  onActiveMarkerChange = (marker, id) => {
    if (id !== null) {
      marker.setFocusedAppearance();
    } else {
      marker.setBlurredAppearance();
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
      if (boundaries && boundaries.contains(marker.position)) {
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
      }
    });

    // Whenever the map is moved around, figure out which markers are off
    // screen and hide them and show the remaining on screen markers
    this.map.addListener('bounds_changed', () => {
      this.hideOffScreenMarkers(this.map, this.filteredMarkers);
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
        category: location.category
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

  // Display given markers, where the map is reposition to fit all
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
      }
      // Update the side bar so that this marker's corresponding list
      // item is no longer active
      this.props.onActiveMarkerChange(this.infoWindow.marker, null);
      // Remove the marker from the infoWindow (thus effectively closing
      // the infoWindow)
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
      }

      // Change the style of the given marker
      givenMarker.setFocusedAppearance();

      // Set the infoWindow's marker to the given marker
      infoWindow.marker = givenMarker;

      // Set the contents of the infoWindow
      infoWindow.setContent(givenMarker.name, `
          <p>
            "${givenMarker.description}"
            (<a href="${givenMarker.descriptionLink}">Source</a>)
          </p>
      `);

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
    return (
      <section className="map-container">
        <map
          id="map"
          className="map"
          name="map"
          tabIndex="0"
          aria-label="Map showing the locations of some hidden gems in Abu Dhabi, UAE."
        ></map>
      </section>
    );
  }
}

export default MapContainer;