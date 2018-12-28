// React
import React, { Component } from 'react';
// Packages
import PropTypes from 'prop-types';
// Images
import loadingGif from '../icons/tiny-loading.gif';

class LocationListItem extends Component {
  constructor(props) {
    super(props);

    this.handleLocationListItemClick = this.handleLocationListItemClick.bind(this);
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
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

  handleLocationListItemClick() {
    this.props.onLocationListItemClick(this.props.location.id);
  }

  render() {
    const location = this.props.location;
    let buttonClassName = (this.props.currentlyFocusedLocationId === location.id) ?
      "unstyled-button search-results-entry search-results-entry-selected" :
      "unstyled-button search-results-entry";

    return (
      <li>
        {/*search-results-entry-selected*/}
        <button
          className={buttonClassName}
          onClick={this.handleLocationListItemClick}
          value={location.id}
          aria-describedby={`loc-btn-desc-${location.id}`}
          aria-pressed={this.props.currentlyFocusedLocationId === location.id}
          aria-haspopup="dialog">
          <h4>{location.name}</h4>
          <p>{location.category}</p>
          <p
            className="hide"
            id={`loc-btn-desc-${location.id}`}
            aria-hidden="true"
            >Click to open an info window with more information about this place.
          </p>
        </button>
      </li>
    );
  }
}

export default LocationListItem;