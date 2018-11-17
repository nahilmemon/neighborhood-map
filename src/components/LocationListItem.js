import React, { Component } from 'react';

class LocationListItem extends Component {
  constructor(props) {
    super(props);

    this.handleLocationListItemClick = this.handleLocationListItemClick.bind(this);
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