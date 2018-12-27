// This function creates and returns a class which creates a custom marker by using
// the Google Maps API's Overlay class. This custom marker is in the form of a
// button with an SVG icon embedded in it so that the markers can be focused
// with the keyboard.
function defineCustomMapMarkerClass() {
  class CustomMapMarker extends window.google.maps.OverlayView {
    constructor(markerProperties) {
      super();
      this.google = window.google;
      this.map = markerProperties.map;
      this.setMap(this.map);

      this.position = markerProperties.position;
      this.title = markerProperties.name;
      this.name = markerProperties.name;
      this.id = markerProperties.id;
      this.description = markerProperties.description;
      this.descriptionLink = markerProperties.descriptionLink;
      this.category = markerProperties.category;
      this.foursquareVenueID = markerProperties.foursquareVenueID;
      this.photo = markerProperties.photo;
      this.formattedAddress = markerProperties.formattedAddress;

      // Width/height of the marker button and inner svg icon to be created
      this.markerSize = parseInt(getComputedStyle(document.body).getPropertyValue('--marker-size'));
      // To store the marker's html
      this.markerButton = null;

      // To remember whether an open info window is attached to this marker
      // Note: this is used to determine whether to show/hide this marker
      // in MapContainer.js
      this.hasOpenInfoWindow = false;
    }

    // Create the actual html for displaying the marker button
    // Also handle event listeners here.
    // Notes: events are bubbled up so that other actions can be performed
    // outside this class definition (e.g. in the MapContainer.js component).
    createMarkerHTML() {
      this.markerButton = document.createElement('button');
      this.markerButton.setAttribute('type', 'button');
      this.markerButton.setAttribute('title', this.title);
      this.markerButton.setAttribute('aria-label', `${this.title} Map Marker`);
      this.markerButton.setAttribute('aria-pressed', false);
      this.markerButton.setAttribute('aria-haspopup', 'dialog');
      this.markerButton.classList.add('unstyled-button', 'marker-button', 'marker-shape');

      this.markerButton.innerHTML = `<p
          id="marker-btn-desc-${this.id}"
          class="hide"
          aria-hidden="true">
          Click to open an info window with more information about this place.</p>`;
      this.markerButton.setAttribute('aria-describedby', `marker-btn-desc-${this.id}`);

      // Handle click event listener.
      this.google.maps.event.addDomListener(this.markerButton, "click", event => {
        this.google.maps.event.trigger(this, "click");
      });
    }

    // Add the marker button to the overlay image pane
    appendMarkerButtonToOverlay() {
      this.getPanes().overlayMouseTarget.appendChild(this.markerButton);
    }

    // Determine the position of the marker button, taking into consideration
    // its geographical location and the size of the marker, so that the marker's
    // bottom tip touches its geographical location
    positionMarkerButton() {
      // Use the projection from the overlay to determine the top-left corner position
      // of the marker button in pixels
      const geographicalPosition = new this.google.maps.LatLng(
        this.position.lat,
        this.position.lng
      );
      const topLeftCornerPixelPosition = this.getProjection().fromLatLngToDivPixel(geographicalPosition);
      // Offset the marker's position so that the marker icon's tip aligns with the
      // marker's geographical position
      let markerIconOffset = 0.5*this.markerSize;
      this.markerButton.style.left = `${topLeftCornerPixelPosition.x - markerIconOffset - 0.5}px`;
      this.markerButton.style.top = `${topLeftCornerPixelPosition.y - 2*markerIconOffset - 10}px`;
    }

    // This is called when both the map's panes are ready/available
    // and the overlay layer has been added to the map
    onAdd() {
      // If the marker button hasn't already been created,
      // then create it and add it to the overlay image pane
      if (!this.markerButton) {
        this.createMarkerHTML();
        this.appendMarkerButtonToOverlay();
      }
    }

    draw() {
      // If the marker button hasn't already been created,
      // then create it and add it to the overlay image pane
      if (!this.markerButton) {
        this.createMarkerHTML();
        this.appendMarkerButtonToOverlay();
      }
      // Position the marker button according to its geographical location
      this.positionMarkerButton();
    }

    // If the marker button exists and is attached to the overlay,
    // then remove it from the overlay and empty its contents
    onRemove() {
      if (this.markerButton) {
        this.markerButton.parentNode.removeChild(this.markerButton);
        this.markerButton = null;
      }
    }

    // Hide the marker button
    hide() {
      if (this.markerButton) {
        this.markerButton.style.display = 'none';
        this.visible = false;
      }
    }

    // Show the marker button
    show() {
      if (this.markerButton) {
        this.markerButton.style.display = 'block';
        this.visible = true;
      }
    }

    // Make the marker button appear focused
    setFocusedAppearance() {
      this.markerButton.classList.add('marker-button-focused');
      this.markerButton.setAttribute('aria-pressed', true);
    }

    // Make the marker button appear not-focused/blurred
    setBlurredAppearance() {
      this.markerButton.classList.remove('marker-button-focused');
      this.markerButton.setAttribute('aria-pressed', false);
    }

    focusMarkerButtonNode() {
      this.markerButton.focus();
    }

    blurMarkerButtonNode() {
      this.markerButton.blur();
    }
  }

  return CustomMapMarker;

};

export default defineCustomMapMarkerClass;