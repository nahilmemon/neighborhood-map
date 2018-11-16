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

    this.createMap = this.createMap.bind(this);
    this.createAllMarkers = this.createAllMarkers.bind(this);
    this.displayGivenMarkers = this.displayGivenMarkers.bind(this);
    this.hideGivenMarkers = this.hideGivenMarkers.bind(this);
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
      // Create the markers
      this.createAllMarkers(this.google, this.props.locationsData);
      // Display the markers
      this.displayGivenMarkers(this.google, this.map, this.markers);
    });
  }

  componentWillUnmount() {
    // Cancel all currently active fetch requests
    axios.cancelAll();
  }

  // Create map instance
  createMap(google) {
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

  // Create the list of markers based on the locationsData
  createAllMarkers(google, locations) {
    this.markers = locations.map((location, index) => {
      return new google.maps.Marker({
        position: location.location,
        title: location.name,
        animation: google.maps.Animation.DROP,
        // icon: defaultIcon,
        id: index,
        description: location.description,
        descriptionLink: location.descriptionLink
      });
    });
  }

  // Display given markers, where the map is reposition to fit all
  // the given markers on screen
  displayGivenMarkers(google, map, markers) {
    // To store the map's boundaries
    let mapBoundaries = new google.maps.LatLngBounds();
    // For each marker, display the marker and extend the map's boundaries
    // in order to include this marker in the visible area on screen
    markers.forEach((marker) => {
      marker.setMap(map);
      mapBoundaries.extend(marker.position);
    });
    // Reposition the map to display all the markers on screen
    map.fitBounds(mapBoundaries);
  }

  // Hide given markers
  hideGivenMarkers(google, map, markers) {
    markers.forEach((marker) => {
      marker.setMap(null);
    });
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