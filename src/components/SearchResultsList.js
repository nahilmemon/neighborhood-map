// React
import React, { Component } from 'react';
// Packages
import PropTypes from 'prop-types';
// Components
import LocationListItem from './LocationListItem.js';

class SearchResultsList extends Component {
  static propTypes = {
    locationsData: PropTypes.arrayOf(PropTypes.object).isRequired,
    onLocationListItemClick: PropTypes.func.isRequired,
    currentlyFocusedLocationId: PropTypes.oneOfType([
        PropTypes.number,
        function(props, propName, componentName) {
          if (/!null/.test(props[propName])) {
            return new Error(
              `${componentName}'s prop: ${propName} has invalid value of ${props[propName]}.`
              + ` Value should equal null.`
            );
          }
        }
      ]),
    isMapLoaded: PropTypes.bool.isRequired
  }

  render() {
    return (
      <section>
        <h2
          id="search-results-heading"
          className="side-bar-heading">
          <span className="sr-only">Filtered </span>Locations<span className="sr-only">Results</span>
        </h2>
        <ul className="search-results">
          {this.props.locationsData.map((location) => {
            return(
              <LocationListItem
                key={location.name}
                location={location}
                onLocationListItemClick={this.props.onLocationListItemClick}
                currentlyFocusedLocationId={this.props.currentlyFocusedLocationId}
                isMapLoaded={this.props.isMapLoaded}
              />
            );
          })}
        </ul>
      </section>
    );
  }
}

export default SearchResultsList;