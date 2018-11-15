import React, { Component } from 'react';

class SearchResultsList extends Component {
  render() {
    return (
      <section>
        <h2 className="side-bar-heading">Locations</h2>
        <ul className="search-results">
          {this.props.locationsData.map((location) => {
            return(
              <li
                key={location.name}
              >
                {/*search-results-entry-selected*/}
                <button className="unstyled-button search-results-entry">
                  <h4>{location.name}</h4>
                  <p>{location.category}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }
}

export default SearchResultsList;