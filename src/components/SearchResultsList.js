import React, { Component } from 'react';

class SearchResultsList extends Component {
  render() {
    return (
      <section>
        <h2 className="side-bar-heading">Locations</h2>
        <ul className="search-results">
          <li>
            <button className="unstyled-button search-results-entry">
              <h4>Umm al Emarat Park</h4>
              <p>Park</p>
            </button>
          </li>
          <li>
            <button className="unstyled-button search-results-entry search-results-entry-selected">
              <h4>Art House Cafe</h4>
              <p>Restaurant, Arts</p>
            </button>
          </li>
        </ul>
      </section>
    );
  }
}

export default SearchResultsList;