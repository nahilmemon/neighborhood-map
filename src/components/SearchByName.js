// React
import React, { Component, Fragment } from 'react';
// Packages
import PropTypes from 'prop-types';

class SearchByName extends Component {
  constructor(props) {
    super(props);
    this.handleFilterByNameTextChange = this.handleFilterByNameTextChange.bind(this);
  }

  static propTypes = {
    filterByNameText: PropTypes.string.isRequired,
    onFilterByNameTextChange: PropTypes.func.isRequired
  }

  handleFilterByNameTextChange(event) {
    this.props.onFilterByNameTextChange(event.target.value);
  }

  render() {
    return (
      <Fragment>
        <h3 className="side-bar-heading">Filter by Name</h3>
        <input
          className="filter-locations-by-name-input"
          type="text"
          placeholder="Filter locations by name:"
          name="Filter locations by name:"
          aria-label="Filter locations by name:"
          value={this.props.filterByNameText}
          onChange={this.handleFilterByNameTextChange}
        ></input>
      </Fragment>
    );
  }
}

export default SearchByName;