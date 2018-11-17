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
// import * as FoursquareAPI from './API/FoursquareAPI.js';
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
    this.handleSideBarButtonClick = this.handleSideBarButtonClick.bind(this);
    this.handleOpenModalButtonClick = this.handleOpenModalButtonClick.bind(this);
    this.handleCloseModalButtonClick = this.handleCloseModalButtonClick.bind(this);
    this.filterLocations = this.filterLocations.bind(this);
  }

  componentDidMount() {
    // Add the cancel prototype method from axios-cancel onto axios
    axiosCancel(axios, {
      debug: false
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
            />
          }
          <MapContainer
            locationsData={this.locationsData}
            filterByNameText={this.state.filterByNameText}
            filterByCategoryOption={this.state.filterByCategoryOption}
            filterLocations={this.filterLocations}
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
