import React, { Component } from 'react';

import SearchForm from './SearchForm.js';
import SearchResultsList from './SearchResultsList.js';

class SideBar extends Component {
  render() {
    return (
      <aside className="side-bar-container">
        <SearchForm
          locationCategories={this.props.locationCategories}
          filterByNameText={this.props.filterByNameText}
          filterByCategoryOption={this.props.filterByCategoryOption}
          onFilterByNameTextChange={this.props.onFilterByNameTextChange}
          onFilterByCategoryOptionChange={this.props.onFilterByCategoryOptionChange}
        />
        <SearchResultsList
          locationsData={this.props.locationsData}
          onLocationListItemClick={this.props.onLocationListItemClick}
          currentlyFocusedLocationId={this.props.currentlyFocusedLocationId}
        />
      </aside>
    );
  }
}

export default SideBar;