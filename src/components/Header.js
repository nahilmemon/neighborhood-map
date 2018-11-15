import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(event) {
    this.props.onButtonClick(event.target.value);
  }

  render() {
    return (
      <header className="header">
        <button
          className="unstyled-button header-button header-search-button"
          type="button"
          value="SideBar"
          onClick={this.handleButtonClick}
        >Search</button>
        <h1
          className="site-heading"
          aria-label="Abu Dhabi Hidden Gems"
        >Hidden Gems</h1>
        <button
          className="unstyled-button header-button header-about-button button-open-modal"
          type="button"
          value="AboutModal"
          onClick={this.handleButtonClick}
        >About Project</button>
      </header>
    );
  }
}

export default Header;