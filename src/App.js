// React
import React, { Component, Fragment } from 'react';
// Packages
import axios from 'axios';
import axiosCancel from 'axios-cancel';
// Styling
import './App.css';
// Local, initial data
import { localLocationsData } from './data/localLocationsData.js';
// API helpers
import * as FoursquareAPI from './API/FoursquareAPI.js';
// Other components
import Header from './components/Header.js';
import SideBar from './components/SideBar.js';
import MapContainer from './components/MapContainer.js';
import AboutModal from './components/AboutModal.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: (window.innerWidth > 600) ? true : false,
      showAboutModal: false,
      filterByNameText: '',
      filterByCategoryOption: 'none',
      currentlyFocusedLocationId: null
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
    this.handleSideBarButtonClick = this.handleSideBarButtonClick.bind(this);
    this.handleOpenModalButtonClick = this.handleOpenModalButtonClick.bind(this);
    this.handleCloseModalButtonClick = this.handleCloseModalButtonClick.bind(this);
    this.filterLocations = this.filterLocations.bind(this);
    this.handleActiveLocationChange = this.handleActiveLocationChange.bind(this);
  }

  componentDidMount() {
    // Add the cancel prototype method from axios-cancel onto axios
    axiosCancel(axios, {
      debug: false
    });

    // Get information about each location using the Foursquare API and
    // save this in this.locationsData
    this.getListItemsFromFoursquare();
  }

  componentWillUnmount() {
    // Cancel the fetch request with the given id
    axios.cancel(this.getListRequestId);

    // Cancel all currently active fetch requests
    axios.cancelAll();
  }

  // Get information about each location using the Foursquare API and save
  // any useful content in this.locationsData
  saveFoursquareInfo(foursquareLocations) {
    let unsearchedFoursquareLocations = foursquareLocations;
    this.locationsData.forEach(loc => {
      // If the given location does have information on Foursquare,
      // then update the location's photo and formatted address with
      // the information available on Foursquare
      if (loc.foursquareVenueID !== null) {
        let matchingFoursquareLocId = unsearchedFoursquareLocations.findIndex(foursquareLoc => {
          return foursquareLoc.venue.id === loc.foursquareVenueID;
        });
        let foursquareLoc;
        if (matchingFoursquareLocId !== undefined && matchingFoursquareLocId !== -1) {
          foursquareLoc = foursquareLocations[matchingFoursquareLocId];
          unsearchedFoursquareLocations.splice(matchingFoursquareLocId, 1);
        }
        // If there was a match, then update the location's photo
        // and formatted address with the match's information
        if (foursquareLoc) {
          // Update the loc's photo attribute
          if (foursquareLoc.photo) {
            loc.photo = {
              prefix: foursquareLoc.photo.prefix,
              suffix: foursquareLoc.photo.suffix,
              width: foursquareLoc.photo.width,
              height: foursquareLoc.photo.height,
            };
          }
          // Update the loc's formatted address attribute
          if (foursquareLoc.venue.location.formattedAddress &&
            foursquareLoc.venue.location.formattedAddress.length > 2) {
            loc.formattedAddress = foursquareLoc.venue.location.formattedAddress;
          } else {
            loc.formattedAddress = null;
          }
        }
        // Otherwise, update the location's photo and formatted address
        // to be null
        else {
          loc.photo = null;
          loc.formattedAddress = null;
        }
      }
      // If the given location does not have information on Foursquare,
      // then update the location's photo and formatted address to be null
      else {
        loc.photo = null;
        loc.formattedAddress = null;
      }
    });
  }

  // Get information about each venue saved in a specific list that I
  // created on Foursquare
  getListItemsFromFoursquare() {
    // To store a cancellation id for axios in case the component
    // gets unmounted before the fetch request has completed
    this.getListRequestId = 'getList';

    FoursquareAPI.getList(this.getListRequestId, '5c02699bb3c961002ca5ecd8')
      .then((response) => {
        console.log('Results: ');
        console.log(response.status);
        console.log(response.data.response);
        if (response.status === 200) {
          let listOfLocations = response.data.response.list.listItems.items;
          this.saveFoursquareInfo(listOfLocations);
        } else {
          throw new Error('Could not get data from Foursquare API');
        }
      }).catch((error) => {
        console.log('Error in completing: ', this.getListRequestId);
        console.log(error);
      });
  }

  // Helper function to find an object in an array whose given key's value
  // matches the requested key's value
  findObjectWithKeyValueInArray(object, desiredKey, desiredValue) {

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

  handleSideBarButtonClick() {
    this.setState(state => ({
      showSideBar: !state.showSideBar
    }));
  }

  handleOpenModalButtonClick() {
    this.setState({ showAboutModal: true }, ()=>{
      this.closeModalButtonNode.focus();
    });
  }

  handleCloseModalButtonClick() {
    // shift focus to open modal button
    this.setState({ showAboutModal: false }, ()=>{
      this.openModalButtonNode.focus();
    });
  }

  filterLocations(allLocations, filterByNameText, filterByCategoryOption){
    // Determine which locations to show based on the user-selected
    // inputs in the search form.
    let filteredLocations = allLocations;
    // Filter the locations by name if the user gave an input
    if (filterByNameText !== '') {
      filteredLocations = filteredLocations.filter(location => {
        return location.name.toLowerCase().includes(filterByNameText.toLowerCase());
      });
    }
    // Filter the locations by category if one is selected
    if (filterByCategoryOption !== 'none') {
      filteredLocations = filteredLocations.filter(location => {
        return location.category.toLowerCase() === filterByCategoryOption;
      });
    }
    return filteredLocations;
  }

  handleActiveLocationChange(locationId) {
    this.setState({
      currentlyFocusedLocationId: locationId
    });
  }

  render() {
    // Determine which locations to show based on the user-selected
    // inputs in the search form.
    let filteredLocations = this.filterLocations(this.locationsData, this.state.filterByNameText, this.state.filterByCategoryOption);

    return (
      <Fragment>
        <Header
          onSideBarButtonClick={this.handleSideBarButtonClick}
          onOpenModalButtonClick={this.handleOpenModalButtonClick}
          openModalButtonNodeRef={node => this.openModalButtonNode = node}
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
              onLocationListItemClick={this.handleActiveLocationChange}
              currentlyFocusedLocationId={this.state.currentlyFocusedLocationId}
            />
          }
          <MapContainer
            locationsData={this.locationsData}
            filterByNameText={this.state.filterByNameText}
            filterByCategoryOption={this.state.filterByCategoryOption}
            filterLocations={this.filterLocations}
            currentlyFocusedLocationId={this.state.currentlyFocusedLocationId}
            onActiveMarkerChange={this.handleActiveLocationChange}
          />
        </main>
        {this.state.showAboutModal &&
          <AboutModal
            showAboutModal={this.state.showAboutModal}
            onCloseModalButtonClick={this.handleCloseModalButtonClick}
            closeModalButtonNodeRef={node => this.closeModalButtonNode = node}
          />
        }
      </Fragment>
    );
  }
}

export default App;
