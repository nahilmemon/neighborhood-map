import React, { Component } from 'react';

import SearchForm from './SearchForm.js';
import SearchResultsList from './SearchResultsList.js';

class SideBar extends Component {
  render() {
    return (
      <aside className="side-bar-container">
        <SearchForm />

        <SearchResultsList
          locationsData={this.props.locationsData}
        />
      </aside>
    );
  }
}

export default SideBar;