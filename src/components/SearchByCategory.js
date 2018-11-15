import React, { Component, Fragment } from 'react';

class SearchByCategory extends Component {
  render() {
    return (
      <Fragment>
        <h3 className="side-bar-heading">Filter by Category</h3>
        <select
          className="filter-locations-by-category-input"
          name="Filter locations by category:"
          aria-label="Filter locations by category:"
        >
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