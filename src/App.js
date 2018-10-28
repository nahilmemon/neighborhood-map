import React, { Component } from 'react';
import axios from 'axios';
import axiosCancel from 'axios-cancel';
import './App.css';
import * as FoursquareAPI from './API/FoursquareAPI.js';

class App extends Component {
  componentDidMount() {
    // Add the cancel prototype method from axios-cancel onto axios
    axiosCancel(axios, {
      debug: false
    });

    this.searchForVenuesRequestId = 'searchForVenues';
    /*
    FoursquareAPI.searchForVenues(this.searchForVenuesRequestId, {
      near: 'Abu Dhabi,UAE',
      query: 'parks',
      limit: 10
    }).then((response) => {
      console.log('Results: ');
      console.log(response.status);
      console.log(response.data.response);
    }).catch((error) => {
      console.log('Error: ', error);
    });
    */
  }

  componentWillUnmount() {
    // Cancel the fetch request with the given id
    // axios.cancel(this.searchForVenuesRequestId);
    // Cancel all currently active fetch requests
    axios.cancelAll();
  }

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
