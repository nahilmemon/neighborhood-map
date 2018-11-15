import React, { Component, Fragment } from 'react';

class SearchByName extends Component {
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
        ></input>
      </Fragment>
    );
  }
}

export default SearchByName;