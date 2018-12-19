// React
import React, { Component, Fragment } from 'react';
// Packages
import PropTypes from 'prop-types';

class SearchByCategory extends Component {
  constructor(props) {
    super(props);
    this.handleFilterByCategoryOptionChange = this.handleFilterByCategoryOptionChange.bind(this);
  }

  static propTypes = {
    locationCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    filterByCategoryOption: PropTypes.string.isRequired,
    onFilterByCategoryOptionChange: PropTypes.func.isRequired
  }

  handleFilterByCategoryOptionChange(event) {
    this.props.onFilterByCategoryOptionChange(event.target.value);
  }

  render() {
    return (
      <Fragment>
        <h3 className="side-bar-heading">Filter by Category</h3>
        <select
          className="filter-locations-by-category-input"
          name="Filter locations by category:"
          aria-label="Filter locations by category:"
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
      </Fragment>
    );
  }
}

export default SearchByCategory;