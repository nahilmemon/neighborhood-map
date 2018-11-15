import React, { Component, Fragment } from 'react';

class AboutModal extends Component {
  render() {
    let modalClassName = this.props.showAboutModal ? 'modal modal-effect modal-show' : 'modal modal-effect';
    return (
      <Fragment>
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
          className={modalClassName}>
          <div className="modal-content">
            <div className="modal-header">
              <h2
                className="modal-heading"
                id="modal-heading">
                About this Site
              </h2>
              <button
                aria-label="Close Modal"
                className="button-close-modal">
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you planning on visiting Abu Dhabi, UAE? Need some tips on where to go, but don't want to do the full-on touristy things?</p>
              <p>Or do you live here and have nothing to do? Have you exhausted all your typical hangout places?</p>
              <p>Here's a couple of hidden gems to explore. You can use the side bar to filter locations or create an optimized route if you plan to do a quick tour in the city and visit a couple of these places.</p>
              <p>Note: This site was created using the following APIs:</p>
              <ul>
                <li>Google Maps</li>
                <li>Foursquare</li>
              </ul>
              <p>The code for this project can be found <a href="https://github.com/nahilmemon/neighborhood-map">here</a>.</p>
            </div>
          </div>
        </section>
        <div
          className="modal-overlay">
        </div>
      </Fragment>
    );
  }
}

export default AboutModal;