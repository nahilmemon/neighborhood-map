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
      ])
  }

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