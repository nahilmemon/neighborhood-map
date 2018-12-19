import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Header extends Component {
  constructor(props) {
    super(props);

    this.handleSideBarButtonClick = this.handleSideBarButtonClick.bind(this);
    this.handleOpenModalButtonClick = this.handleOpenModalButtonClick.bind(this);
  }

  static propTypes = {
    onSideBarButtonClick: PropTypes.func.isRequired,
    onOpenModalButtonClick: PropTypes.func.isRequired,
    openModalButtonNodeRef: PropTypes.func.isRequired
  }

  handleSideBarButtonClick(event) {
    this.props.onSideBarButtonClick(event.target.value);
  }

  handleOpenModalButtonClick(event) {
    this.props.onOpenModalButtonClick(event.target.value);
  }

  render() {
    return (
      <header className="header">
        <button
          className="unstyled-button header-button header-search-button"
          type="button"
          value="SideBar"
          onClick={this.handleSideBarButtonClick}
        >Search</button>
        <h1
          className="site-heading"
          aria-label="Abu Dhabi Hidden Gems"
        >Hidden Gems</h1>
        <button
          className="unstyled-button header-button header-about-button button-open-modal"
          type="button"
          value="AboutModal"
          onClick={this.handleOpenModalButtonClick}
          ref={this.props.openModalButtonNodeRef}
        >About Project</button>
      </header>
    );
  }
}

export default Header;