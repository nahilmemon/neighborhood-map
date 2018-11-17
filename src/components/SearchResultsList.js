import React, { Component } from 'react';

import LocationListItem from './LocationListItem.js';

class SearchResultsList extends Component {
  render() {
    return (
      <section>
        <h2 className="side-bar-heading">Locations</h2>
        <ul className="search-results">
          {this.props.locationsData.map((location) => {
            return(
              <LocationListItem
                key={location.name}
                location={location}
                onLocationListItemClick={this.props.onLocationListItemClick}
                currentlyFocusedLocationId={this.props.currentlyFocusedLocationId}
              />
            );
          })}
        </ul>
      </section>
    );
  }
}

export default SearchResultsList;