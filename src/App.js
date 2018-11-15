// React
import React, { Component, Fragment } from 'react';
// Packages
import axios from 'axios';
import axiosCancel from 'axios-cancel';
// Styling
import './App.css';
import { mapStyles } from './mapStyles.js';
// Local, initial data
import { localLocationsData } from './data/localLocationsData.js';
// API helpers
import * as FoursquareAPI from './API/FoursquareAPI.js';
import loadGoogleMapsAPI from './API/loadGoogleMapsAPI.js';
// Other components
import Header from './components/Header.js';
import SideBar from './components/SideBar.js';
import AboutModal from './components/AboutModal.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: (window.innerWidth > 600) ? true : false,
      showAboutModal: false,
      filterByNameText: '',
      filterByCategoryOption: 'none'
    };

    // To store compulsory information about each location
    this.locationsData = localLocationsData;

    // Figure out the location categories
    let locationCategoriesWithDuplicates = localLocationsData.map((location) => location.category);
    this.locationCategories = locationCategoriesWithDuplicates.filter(function(item, index){
      return locationCategoriesWithDuplicates.indexOf(item) >= index;
    });

    this.handleFilterByNameTextChange = this.handleFilterByNameTextChange.bind(this);
    this.handleFilterByCategoryOptionChange = this.handleFilterByCategoryOptionChange.bind(this);
    this.handleButtonClickToToggleComponentDisplay = this.handleButtonClickToToggleComponentDisplay.bind(this);
  }

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
        center: {lat: 24.5172938, lng: 54.370662},
        zoom: 13,
        styles: mapStyles,
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

  handleFilterByNameTextChange(filterByNameText) {
    this.setState({
      filterByNameText: filterByNameText
    });
  }

  handleFilterByCategoryOptionChange(filterByCategoryOption) {
    this.setState({
      filterByCategoryOption: filterByCategoryOption
    });
  }

  // Toggle the display of the input component when a button is clicked
  handleButtonClickToToggleComponentDisplay(componentName) {
    let componentNameDisplayProperty = `show${componentName}`;
    this.setState((state) => ({
      [`show${componentName}`]: !state[`show${componentName}`]
    }));
  }

  render() {
    // Determine which locations to show based on the user-selected
    // inputs in the search form.
    let filteredLocations = this.locationsData;
    if (this.state.filterByNameText !== '') {
      filteredLocations = filteredLocations.filter(location => {
        return location.name.toLowerCase().includes(this.state.filterByNameText.toLowerCase());
      });
    }
    if (this.state.filterByCategoryOption !== 'none') {
      filteredLocations = filteredLocations.filter(location => {
        return location.category.toLowerCase() === this.state.filterByCategoryOption;
      });
    }

    return (
      <Fragment>
        <Header
          onButtonClick={this.handleButtonClickToToggleComponentDisplay}
        />
        <main>
          {this.state.showSideBar &&
            <SideBar
              locationsData={filteredLocations}
              locationCategories={this.locationCategories}
              filterByNameText={this.state.filterByNameText}
              filterByCategoryOption={this.state.filterByCategoryOption}
              onFilterByNameTextChange={this.handleFilterByNameTextChange}
              onFilterByCategoryOptionChange={this.handleFilterByCategoryOptionChange}
            />
          }
          <section className="map-container">
            <map
              id="map"
              className="map"
              name="map"
              tabIndex="0"
              aria-label="Map showing the locations of some hidden gems in Abu Dhabi, UAE."
            ></map>
          </section>
        </main>
        <AboutModal
          showAboutModal={this.state.showAboutModal}
          onCloseButtonClick={this.handleButtonClickToToggleComponentDisplay}
        />
      </Fragment>
    );
  }
}

export default App;
