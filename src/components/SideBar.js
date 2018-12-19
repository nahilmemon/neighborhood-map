// React
import React, { Component } from 'react';
// Packages
import PropTypes from 'prop-types';
// Components
import SearchForm from './SearchForm.js';
import SearchResultsList from './SearchResultsList.js';

class SideBar extends Component {
  static propTypes = {
    locationsData: PropTypes.arrayOf(PropTypes.object).isRequired,
    locationCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    filterByNameText: PropTypes.string.isRequired,
    filterByCategoryOption: PropTypes.string.isRequired,
    onFilterByNameTextChange: PropTypes.func.isRequired,
    onFilterByCategoryOptionChange: PropTypes.func.isRequired,
    onLocationListItemClick: PropTypes.func.isRequired,
    currentlyFocusedLocationId: PropTypes.oneOfType([
        PropTypes.number,
        function(props, propName, componentName) {
          if (/!null/.test(props[propName])) {
            return new Error(
              `${componentName}'s prop: ${propName} has invalid value of ${props[propName]}.`
              + ` Value should equal null.`
            );
          }
        }
      ])
  }

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