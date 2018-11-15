import React, { Component } from 'react';

import SearchByName from './SearchByName.js';
import SearchByCategory from './SearchByCategory.js';

class SearchForm extends Component {
  render() {
    return (
      <section>
        <h2 className="side-bar-heading">Filter Locations</h2>
        <form className="padding-inline-start">
          <SearchByName />
          <SearchByCategory />
        </form>
      </section>
    );
  }
}

export default SearchForm;