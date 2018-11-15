import React, { Component } from 'react';

import SearchByName from './SearchByName.js';

class SearchForm extends Component {
  render() {
    return (
      <section>
        <h2 className="side-bar-heading">Filter Locations</h2>
        <form className="padding-inline-start">
          <SearchByName />

          <h3 className="side-bar-heading">Filter by Category</h3>
          <select
            className="filter-locations-by-category-input"
            name="Filter locations by category:"
            aria-label="Filter locations by category:"
          >
            <option value="parks">Parks</option>
            <option value="restaurants">Restaurants</option>
            <option value="shopping">Shopping</option>
          </select>
        </form>
      </section>
    );
  }
}

export default SearchForm;