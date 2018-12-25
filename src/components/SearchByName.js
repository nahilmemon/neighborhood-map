// React
import React, { Component, Fragment } from 'react';
// Packages
import PropTypes from 'prop-types';
// Images
import loadingGif from '../icons/tiny-loading.gif';

class SearchByName extends Component {
  constructor(props) {
    super(props);
    this.handleFilterByNameTextChange = this.handleFilterByNameTextChange.bind(this);
  }

  static propTypes = {
    filterByNameText: PropTypes.string.isRequired,
    onFilterByNameTextChange: PropTypes.func.isRequired,
    isMapLoaded: PropTypes.bool.isRequired
  }

  handleFilterByNameTextChange(event) {
    this.props.onFilterByNameTextChange(event.target.value);
  }

  render() {
    let input;
    // Disable the input if the map, its markers, and the info window haven't
    // fully loaded yet
    if (this.props.isMapLoaded === false) {
      input = <input
          id="filter-locations-by-name-input"
          className="filter-locations-by-name-input"
          type="text"
          placeholder="Filter locations by name:"
          name="Filter locations by name:"
          value={this.props.filterByNameText}
          onChange={this.handleFilterByNameTextChange}
          disabled
        ></input>;
    }
    // Otherwise, enable the button
    else {
      input = <input
          id="filter-locations-by-name-input"
          className="filter-locations-by-name-input"
          type="text"
          placeholder="Filter locations by name:"
          name="Filter locations by name:"
          value={this.props.filterByNameText}
          onChange={this.handleFilterByNameTextChange}
        ></input>;
    }
    return (
      <Fragment>
        <h3 className="side-bar-heading">
          <label htmlFor="filter-locations-by-name-input">
            Filter <span className="sr-only">Locations</span> by Name.
            <span className="sr-only">Editing text will immediately filter the list of locations.</span>
          </label>
        </h3>
        {input}
      </Fragment>
    );
  }
}

export default SearchByName;