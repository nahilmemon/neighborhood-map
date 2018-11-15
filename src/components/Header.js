import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <button className="unstyled-button header-button header-search-button">Search</button>
        <h1 className="site-heading">AD Hidden Gems</h1>
        <button className="unstyled-button header-button header-about-button button-open-modal">About Project</button>
      </header>
    );
  }
}

export default Header;