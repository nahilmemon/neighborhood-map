import React, { Component } from 'react';

class LocationListItem extends Component {
  render() {
    const location = this.props.location;
    return (
      <li>
        {/*search-results-entry-selected*/}
        <button className="unstyled-button search-results-entry">
          <h4>{location.name}</h4>
          <p>{location.category}</p>
        </button>
      </li>
    );
  }
}

export default LocationListItem;