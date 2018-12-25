// React
import React, { Component, Fragment } from 'react';
// Packages
import PropTypes from 'prop-types';
// Images
import loadingGif from '../icons/tiny-loading.gif';

class SearchByCategory extends Component {
  constructor(props) {
    super(props);
    this.handleFilterByCategoryOptionChange = this.handleFilterByCategoryOptionChange.bind(this);
  }

  static propTypes = {
    locationCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    filterByCategoryOption: PropTypes.string.isRequired,
    onFilterByCategoryOptionChange: PropTypes.func.isRequired,
    isMapLoaded: PropTypes.bool.isRequired
  }

  handleFilterByCategoryOptionChange(event) {
    this.props.onFilterByCategoryOptionChange(event.target.value);
  }

  render() {
    let select;
    // Disable the input if the map, its markers, and the info window haven't
    // fully loaded yet
    if (this.props.isMapLoaded === false) {
      select = <select
          id="filter-locations-by-category-input"
          className="filter-locations-by-category-input"
          name="Filter locations by category:"
          value={this.props.filterByCategoryOption}
          onChange={this.handleFilterByCategoryOptionChange}
          disabled
        >
          {/* Default option - signifies not to filter by category */}
          <option value="none">None</option>
          {/* Get other options dynamically from the
          this.props.locationCategories array */}
          {this.props.locationCategories.map((category) => {
            return(
              <option
                key={category}
                value={category.toLowerCase()}
              >
                {category}
              </option>
            );
          })}
        </select>
    }
    // Otherwise, enable the button
    else {
      select = <select
          id="filter-locations-by-category-input"
          className="filter-locations-by-category-input"
          name="Filter locations by category:"
          value={this.props.filterByCategoryOption}
          onChange={this.handleFilterByCategoryOptionChange}
        >
          {/* Default option - signifies not to filter by category */}
          <option value="none">None</option>
          {/* Get other options dynamically from the
          this.props.locationCategories array */}
          {this.props.locationCategories.map((category) => {
            return(
              <option
                key={category}
                value={category.toLowerCase()}
              >
                {category}
              </option>
            );
          })}
        </select>
    }
    return (
      <Fragment>
        <h3 className="side-bar-heading">
          <label htmlFor="filter-locations-by-category-input">
            Filter <span className="sr-only">Locations</span> by Category
            <span className="sr-only">Selecting an option will immediately filter the list of locations.</span>
          </label>
        </h3>
        {select}
      </Fragment>
    );
  }
}

export default SearchByCategory;