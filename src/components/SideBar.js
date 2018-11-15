import React, { Component } from 'react';

class SideBar extends Component {
  render() {
    return (
      <aside className="side-bar-container">
        <section>
          <h2 className="side-bar-heading">Filter Locations</h2>
          <form className="padding-inline-start">
            <h3 className="side-bar-heading">Filter by Name</h3>
            <input
              className="filter-locations-by-name-input"
              type="text"
              placeholder="Filter locations by name:"
              name="Filter locations by name:"
              aria-label="Filter locations by name:"
            ></input>

            <h3 className="side-bar-heading">Filter by Category</h3>
            <select
              className="filter-locations-by-category-input"
              name="Filter locations by category:"
              aria-label="Filter locations by category:"
            >
              <option value="parks">Parks</option>
              <option value="restaurants">Restaurants</option>
              <option value="shopping">Shopping</option>
            </select>
          </form>
        </section>

        <section>
          <h2 className="side-bar-heading">Locations</h2>
          <ul className="search-results">
            <li>
              <button className="unstyled-button search-results-entry">
                <h4>Umm al Emarat Park</h4>
                <p>Park</p>
              </button>
            </li>
            <li>
              <button className="unstyled-button search-results-entry search-results-entry-selected">
                <h4>Art House Cafe</h4>
                <p>Restaurant, Arts</p>
              </button>
            </li>
          </ul>
        </section>
      </aside>
    );
  }
}

export default SideBar;