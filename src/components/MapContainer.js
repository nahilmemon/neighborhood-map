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

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    // this.createMap = this.createMap.bind(this);
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

      // Create the map
      this.createMap(this.google);
      // Create the marker icons for the default and focused scenarios
      // Get the CSS variables from the root element
      let rootStyles = getComputedStyle(document.body);
      this.defaultMarkerIcon = this.createColoredMarkerIcon(this.google, rootStyles.getPropertyValue('--primary-light-color'));
      this.focusedMarkerIcon = this.createColoredMarkerIcon(this.google, rootStyles.getPropertyValue('--primary-dark-color'));
      // Create the infoWindow
      this.createInfoWindow(this.google);
      // Create and display the markers
      this.createAllMarkers(this.google, this.map, this.props.locationsData);
      // Reposition the map to fit all the markers
      this.displayGivenMarkers(this.google, this.map, this.markers);
    });
  }

  componentWillUnmount() {
    // Cancel all currently active fetch requests
    axios.cancelAll();
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
  }

  // Create a marker icon whose color is the color given
  // Note: color is given in the following format: '#xxxxxx'
  createColoredMarkerIcon = (google, color) => {
    // Convert color format from '#xxxxxx' to 'xxxxxx'
    color = color.trim().substr(1);
    // Create a marker image using an asset from Google
    return new google.maps.MarkerImage(
      `http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|${color}|40|_|%E2%80%A2`,
      // Make the marker 21px x 34px in size
      new google.maps.Size(21, 34),
      // Make the origin of the marker (0, 0)
      new google.maps.Point(0, 0),
      // Anchor the marker at (10, 34)
      new google.maps.Point(10, 34),
      // Make the marker 21px x 34px in size
      new google.maps.Size(21,34)
    );
  }

  // Create the list of markers based on the locationsData
  createAllMarkers = (google, map, locations) => {
    this.markers = locations.map((location, index) => {
      let marker = new google.maps.Marker({
        map: map,
        position: location.location,
        visible: true,
        name: location.name,
        animation: google.maps.Animation.DROP,
        icon: this.defaultMarkerIcon,
        id: location.id,
        description: location.description,
        descriptionLink: location.descriptionLink,
        category: location.category
      });

      // Add an event listener so that when a marker is clicked,
      // an infoWindow describing the marker's properties will display
      marker.addListener('click', () => {
        marker.setIcon(this.focusedMarkerIcon);
        this.populateInfoWindow(this.map, marker, this.infoWindow);
        // Also make the corresponding list item in the side bar active
        this.props.onActiveMarkerChange(marker.id);
      });

      // Add mouse event listeners so that hover on the marker changes
      // its color
      marker.addListener('mouseover', () => {
        marker.setIcon(this.focusedMarkerIcon);
      });
      marker.addListener('mouseout', () => {
        if (this.infoWindow.marker !== marker) {
          marker.setIcon(this.defaultMarkerIcon);
        }
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
      marker.setVisible(true);
      mapBoundaries.extend(marker.position);
    });
    // Reposition the map to display all the markers on screen
    map.fitBounds(mapBoundaries);
  }

  // Hide given markers
  hideGivenMarkers = (google, map, markers) => {
    markers.forEach((marker) => {
      marker.setVisible(false);
    });
  }

  // Create the info window to display information about a selected place
  createInfoWindow = (google) => {
    this.infoWindow = new google.maps.InfoWindow({
      maxWidth: 245
    });
  }

  // Populate the infoWindow with information regarding the given marker.
  // Note: this is set to only display one infoWindow on screen at a time.
  populateInfoWindow = (map, givenMarker, infoWindow) => {
    // Populate the infoWindow if the given marker is different from the
    // infoWindow's current marker
    if (infoWindow.marker !== givenMarker) {
      // Reset the style of the infoWindow's previous marker
      if (infoWindow.marker !== undefined && infoWindow.marker !== null) {
        infoWindow.marker.setIcon(this.defaultMarkerIcon);
      }

      // Change the style of the given marker
      givenMarker.setIcon(this.focusedMarkerIcon);

      // Set the infoWindow's marker to the given marker
      infoWindow.marker = givenMarker;

      // Set the contents of the infoWindow
      infoWindow.setContent(`
        <div class="info-window">
          <h4>${givenMarker.name}</h4>
          <p>
            ${givenMarker.description}
            (<a href="${givenMarker.descriptionLink}">Source</a>)
          </p>
        </div>
      `);

      // Open and display the infoWindow
      infoWindow.open(map, givenMarker);

      // Add an event listener to clear the infoWindow's marker when
      // the close button is clicked
      infoWindow.addListener('closeclick', () => {
        // Reset the style of the infoWindow's current marker
        if (infoWindow.marker !== undefined && infoWindow.marker !== null) {
          infoWindow.marker.setIcon(this.defaultMarkerIcon);
        }
        // Update the side bar so that this marker's corresponding list
        // item is no longer active
        this.props.onActiveMarkerChange(null);
        // Remove the marker from the infoWindow (thus effectively closing
        // the infoWindow)
        infoWindow.marker = null;
      });
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
      // Close the infoWindow if it's already been created and the
      // related marker is no longer visiible after filtration
      if (infoWindow && infoWindow.marker && infoWindow.marker.visible === false) {
        infoWindow.close();
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
      markerToFocus.setIcon(this.focusedMarkerIcon);
      // Populate the infoWindow with this marker's info and display the
      // infoWindow
      this.populateInfoWindow(map, markerToFocus, infoWindow);
    }
  }

  render() {
    // Only display the filtered location markers
    this.displayFilteredMarkers(this.google, this.map, this.markers, this.infoWindow);

    // If the user has clicked on a list item in the side bar component,
    // then focus the corresponding marker and display an infoWindow about it
    if (this.markers) {
      this.focusMarkerOfCurrentlyFocusedLocation(this.map, this.infoWindow, this.props.currentlyFocusedLocationId, this.markers);
    }

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