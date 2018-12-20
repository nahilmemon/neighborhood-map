// React
import React, { Component } from 'react';
// Packages
import PropTypes from 'prop-types';
// Components
import SearchByName from './SearchByName.js';
import SearchByCategory from './SearchByCategory.js';

class SearchForm extends Component {
  static propTypes = {
    locationCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    filterByNameText: PropTypes.string.isRequired,
    filterByCategoryOption: PropTypes.string.isRequired,
    onFilterByNameTextChange: PropTypes.func.isRequired,
    onFilterByCategoryOptionChange: PropTypes.func.isRequired,
    isMapLoaded: PropTypes.bool.isRequired
  }

  render() {
    return (
      <section>
        <h2 className="side-bar-heading">Filter Locations</h2>
        <form className="padding-inline-start">
          <SearchByName
            filterByNameText={this.props.filterByNameText}
            onFilterByNameTextChange={this.props.onFilterByNameTextChange}
            isMapLoaded={this.props.isMapLoaded}
          />
          <SearchByCategory
            locationCategories={this.props.locationCategories}
            filterByCategoryOption={this.props.filterByCategoryOption}
            onFilterByCategoryOptionChange={this.props.onFilterByCategoryOptionChange}
            isMapLoaded={this.props.isMapLoaded}
          />
        </form>
      </section>
    );
  }
}

export default SearchForm;