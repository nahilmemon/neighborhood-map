import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class AboutModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalClassName: 'modal modal-effect modal-show'
    }

    this.handleCloseModalButtonClick = this.handleCloseModalButtonClick.bind(this);
    this.handleKeyDownEvent = this.handleKeyDownEvent.bind(this);
    this.findFocusableElementsWithinModal = this.findFocusableElementsWithinModal.bind(this);
  }

  static propTypes = {
    showAboutModal: PropTypes.bool.isRequired,
    onCloseModalButtonClick: PropTypes.func.isRequired,
    closeModalButtonNodeRef: PropTypes.func.isRequired
  }

  componentDidMount() {
    // Find all the  first and last focusable elements within the modal
    this.findFocusableElementsWithinModal();
  }

  handleCloseModalButtonClick(event) {
    // Display the modal closing animation before actually removing
    // the modal in App.js
    this.setState({ modalClassName: 'modal modal-effect' }, () => {
      setTimeout(this.props.onCloseModalButtonClick, 300);
    });
  }

  // Find all the first and last focusable elements within the modal
  findFocusableElementsWithinModal() {
    // Find all focusable children
    let potentiallyFocusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    let focusableElementsWithinModal = this.modalRef.querySelectorAll(potentiallyFocusableElementsString);
    // Convert the NodeList to an Array
    focusableElementsWithinModal = Array.prototype.slice.call(focusableElementsWithinModal);

    this.firstTabStopInModal = focusableElementsWithinModal[0];
    this.lastTabStopInModal = focusableElementsWithinModal[focusableElementsWithinModal.length - 1];
  }

  // To handle keydown events while the modal is open
  handleKeyDownEvent(event) {
    // Close the modal if the user presses the ESCAPE key
    if (event.key === 'Escape') {
      this.handleCloseModalButtonClick();
    }

    // Trap the focus within the modal if the user presses
    // the TAB or SHIFT + TAB keys
    if (event.key === "Tab") {
      // Case: SHIFT + TAB keys
      if (event.shiftKey) {
        if (document.activeElement === this.firstTabStopInModal) {
          event.preventDefault();
          this.lastTabStopInModal.focus();
        }
      // Case: TAB key
      } else {
        if (document.activeElement === this.lastTabStopInModal) {
          event.preventDefault();
          this.firstTabStopInModal.focus();
        }
      }
    }
  }

  render() {
    return (
      <Fragment>
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
          className={this.state.modalClassName}
          onKeyDown={this.handleKeyDownEvent}
          ref={node => this.modalRef = node}>
          <div className="modal-content">
            <div className="modal-header">
              <h2
                className="modal-heading"
                id="modal-heading">
                About this Site
              </h2>
              <button
                aria-label="Close Modal"
                className="button-close-modal"
                type="button"
                value="AboutModal"
                onClick={this.handleCloseModalButtonClick}
                ref={this.props.closeModalButtonNodeRef}>
                ×
                {/* ref={closeModalButton => closeModalButton && closeModalButton.focus()} */}
              </button>
            </div>
            <div className="modal-body">
              <h3>About this Site</h3>
              <p>Are you planning on visiting Abu Dhabi, UAE? Need some tips on where to go, but don't want to do the full-on touristy things?</p>
              <p>Or do you live here and have nothing to do? Have you exhausted all your typical hangout places?</p>
              <p>Here's a couple of hidden gems to explore. You can use the side bar to filter locations by name or type.</p>
              <h3>Resources Used</h3>
              <p>This site was created using the following APIs:</p>
              <ul>
                <li>Google Maps</li>
                <li>Foursquare</li>
              </ul>
              <p>A list of other resources used can be found <a href="https://github.com/nahilmemon/neighborhood-map#resources-used">here</a>.</p>
              <h3>Site Code</h3>
              <p>The code for this project can be found <a href="https://github.com/nahilmemon/neighborhood-map">here</a>.</p>
            </div>
          </div>
        </section>
        <div
          className="modal-overlay"
          onClick={this.handleCloseModalButtonClick}>
        </div>
      </Fragment>
    );
  }
}

export default AboutModal;