// React
import React, { Component } from 'react';
// Packages
import PropTypes from 'prop-types';

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
      ])
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
          value={location.id}>
          <h4>{location.name}</h4>
          <p>{location.category}</p>
        </button>
      </li>
    );
  }
}

export default LocationListItem;