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
    return (
      <li>
        {/*search-results-entry-selected*/}
        <button
          className="unstyled-button search-results-entry"
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