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

      // Create and display the map
      this.createMap(this.google);
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