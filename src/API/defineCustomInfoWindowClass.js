// This function creates and returns a class which creates a custom info window
// by using the Google Maps API's Overlay class in order to easily manage focus
// when it opens/closes and to style it more easily/semantically.
function defineCustomInfoWindowClass() {
  class CustomInfoWindow extends window.google.maps.OverlayView {
    constructor(infoWindowProperties) {
      super();
      this.google = window.google;

      this.position = infoWindowProperties.position;

      this.markerHeight = 50;
      this.tipHeight = 8;

      this.title = infoWindowProperties.title;
      this.content = infoWindowProperties.content;

      this.infoWindowContainer = null;
      this.marker = null;

      this.map = infoWindowProperties.map;
      this.setMap(this.map);

      // Stop clicks and drags occuring on the info window container from
      // bubbling up to the map
      // this.stopEventPropagation();
    }

    // Create the actual html for displaying the info window based on the
    // title and content given
    // Also handle event listeners here
    // Note: events are bubbled up so that other actions can be performed
    // outside this class definition (e.g. in the MapContainer.js component)
    createInfoWindowHTML() {
      // The basic skeleton of the info window popup looks like this:
      /*
        // The following article is the container for the info window
        <article class="info-window-container">
          // The following div displays the bottom pointing arrow tip beneath
          // the info window. This needs to be the parent of the actual content
          // for the styling to work since the tip design is achieved using css.
          <div class="popup-bubble-anchor info-window-container-anchor-tip">
            // The following div is where the actual information will be shown
            <div class="popup-bubble-content info-window-contents">
              <header class="popup-bubble-content info-window-contents-header">
                <h4>this.header-title<h4> // Provided
                <span>x</span> // (close button)
              </header>
              // The following div is provided
              <div class="popup-bubble-content info-window-contents-body">
                ...
              </div>
            </div>
          </div>
        </article>
      */
      let infoWindowContents = document.createElement('div');
      infoWindowContents.classList.add('info-window-contents');

      let contentHeader = document.createElement('header');
      contentHeader.classList.add('info-window-contents-header');
      contentHeader.innerHTML = `
        <h4 class="info-window-contents-header-heading">${this.title}</h4>
        <button
          aria-label="Close info window describing ${this.title}"
          class="button-close-info-window"
          type="button"
          value="CloseInfoWindow">
          ×
        </button>`;

      let contentBody = document.createElement('div');
      contentBody.classList.add('info-window-contents-body');
      contentBody.innerHTML = this.content;

      infoWindowContents.appendChild(contentHeader);
      infoWindowContents.appendChild(contentBody);

      let infoWindowContainerAnchorTipDiv = document.createElement('div');
      infoWindowContainerAnchorTipDiv.classList.add('info-window-container-anchor-tip');
      infoWindowContainerAnchorTipDiv.appendChild(infoWindowContents);

      this.infoWindowContainer = document.createElement('article');
      this.infoWindowContainer.classList.add('info-window-container');
      this.infoWindowContainer.appendChild(infoWindowContainerAnchorTipDiv);

      // Handle close button click event listener
      this.google.maps.event.addDomListener(this.infoWindowContainer, "click", event => {
        if (event.target.classList.contains('button-close-info-window')) {
          this.google.maps.event.trigger(this, "closeclick", event);
        }
      });

      // If there is not set position or the content is null, then hide the info window
      if (this.position === null || this.content === null) {
        this.hide();
      }
    }

    // Add the marker button to the overlay image pane
    appendInfoWindowToOverlay() {
      this.getPanes().floatPane.appendChild(this.infoWindowContainer);
    }

    // Determine the position of the info window, taking into consideration
    // its geographical location and the size of the marker, so that the marker's
    // bottom tip touches its geographical location
    positionInfoWindow() {
      if (this.position !== null) {
        // Convert the given position from {lat: xx, lng: xx} to an actual google maps
        // LatLng object
        const geographicalPosition = new this.google.maps.LatLng(
          this.position.lat,
          this.position.lng
        );
        // Use the projection from the overlay to determine the top-left corner position
        // of the info window container in pixels
        let topLeftCornerPixelPosition = this.getProjection().fromLatLngToDivPixel(geographicalPosition);
        // Offset the info window container's position so that the anchor tip
        // touches the top of the corresponding marker button svg icon
        let tipOffsetY = this.markerHeight - this.tipHeight;
        this.infoWindowContainer.style.left = `${topLeftCornerPixelPosition.x}px`;
        this.infoWindowContainer.style.top = `${(topLeftCornerPixelPosition.y - tipOffsetY)}px`;
      }
    }

    // This is called when both the map's panes are ready/available
    // and the overlay layer has been added to the map
    onAdd() {
      // If the info window container hasn't already been created,
      // then create it and add it to the overlay view's float pane
      if (!this.infoWindowContainer) {
        this.createInfoWindowHTML();
        this.appendInfoWindowToOverlay();
      }
    }

    // This is called when the info window container needs to be drawn
    draw() {
      // If the info window container hasn't already been created,
      // then create it and add it to the overlay view's float pane
      if (!this.infoWindowContainer) {
        this.createInfoWindowHTML();
        this.appendInfoWindowToOverlay();
      }
      // Position the info window container according to its corresponding
      // marker's geographical position
      this.positionInfoWindow();
    }

    // If the info window container exists and is attached to the overlay,
    // then remove it from the overlay and empty its contents
    onRemove() {
      if (this.infoWindowContainer) {
        this.infoWindowContainer.parentNode.removeChild(this.infoWindowContainer);
        this.infoWindowContainer = null;
      }
    }

    // Change the contents of the info window
    // setContent(newContent) {
    //   this.content = newContent;
    //   // this.createInfoWindowHTML();
    //   // this.appendInfoWindowToOverlay();
    //   // this.draw();
    // }

    setContent(newTitle, newContent) {
      this.title = newTitle;
      this.content = newContent;

      this.infoWindowContainer.querySelector('.info-window-contents-header-heading').innerText = newTitle;
      this.infoWindowContainer.querySelector('.info-window-contents-body').innerHTML = newContent;
    }

    // Change the contents of the info window
    setPosition(newPosition) {
      this.position = newPosition;

      this.draw();
    }

    // Hide the info window container
    hide() {
      if (this.infoWindowContainer) {
        this.infoWindowContainer.style.visibility = 'hidden';
        this.visible = false;
      }
    }

    // Show the info window container
    show() {
      if (this.infoWindowContainer) {
        this.infoWindowContainer.style.visibility = 'visible';
        this.visible = true;
      }
    }

    // This stops all click and drag events occuring on the info window
    // container from bubbling up to the map
    stopEventPropagation() {
      this.infoWindowContainer.style.cursor = 'auto';
      // Stop event propagation from occurring for all of the events listed
      // in the following array by adding an event listener and calling
      // event.stopPropagation
      ['click', 'dblclick', 'contextmenu', 'wheel', 'mousedown', 'touchstart',
        'pointerdown']
        .forEach(function(event) {
          this.infoWindowContainer.addEventListener(event, function(e) {
            e.stopPropagation();
          });
        });
    }
  }

  return CustomInfoWindow;

}

export default defineCustomInfoWindowClass;