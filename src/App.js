import React, { Component } from 'react';
import axios from 'axios';
import axiosCancel from 'axios-cancel';
import './App.css';
import * as FoursquareAPI from './API/FoursquareAPI.js';
import loadGoogleMapsAPI from './API/loadGoogleMapsAPI.js';

class App extends Component {
  componentDidMount() {
    // Add the cancel prototype method from axios-cancel onto axios
    axiosCancel(axios, {
      debug: false
    });

    /*
    this.searchForVenuesRequestId = 'searchForVenues';
    FoursquareAPI.searchForVenues(this.searchForVenuesRequestId, {
      near: 'asd',
      query: 'fads',
      limit: 'asd'
    }).then((response) => {
      console.log('Results: ');
      console.log(response.status);
      console.log(response.data.response);
    }).catch((error) => {
      console.log('Error in completing: ', this.searchForVenuesRequestId);
      console.log(error);
    });
    */

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
      this.map = new this.google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        // styles: mapStyles,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: this.google.maps.MapTypeControlStyle.HORIZONTAL_BAR
        }
      });
    });
  }

  componentWillUnmount() {
    // Cancel the fetch request with the given id
    // axios.cancel(this.searchForVenuesRequestId);
    // Cancel all currently active fetch requests
    axios.cancelAll();
  }

  render() {
    return (
      <div className="map" id="map">
      </div>
    );
  }
}

export default App;
