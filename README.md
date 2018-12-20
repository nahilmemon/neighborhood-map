# Neighborhood Map Web App

## Table of Contents
* [Description](#description)
* [How to Run the Web App](#how-to-run-the-web-app)
* [Minimum Requirements](#minimum-requirements)
* [Extra Features](#extra-features)
* [Project Structure](#project-structure)
* [Resources Used](#resources-used)

## Description
This single page web app features a list view and map view depicting information about various hidden gems to visit in Abu Dhabi, UAE. This project was built from scratch with the React framework using the [Create React App toolchain](https://github.com/facebook/create-react-app) and the [Google Maps API]( https://developers.google.com/maps/documentation/javascript/tutorial) to display an interactive map. [Online articles](#resources-used) and the [Foursquare API](https://developer.foursquare.com/places-api) were also used to retrieve information about each location. This web app was built to display responsively on various sized devices, work offline using a service worker and the [Workbox libraries]( https://developers.google.com/web/tools/workbox/), and follow proper accessibility practices as outlined by [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/) and [Accessible Rich Internet Applications (WAI-ARIA) 1.1](https://www.w3.org/TR/wai-aria-1.1/).

## How to Run the Web App
### Production Mode
#### Option A
1. Go [here]() to view the app in your browser.
#### Option B
1. Download the repository.
2. Open a command prompt terminal and cd (change into the directory) where the repository has been saved.
3. Install all the needed npm dependencies using the following command:
    * `npm install`
    * Note: node.js can be downloaded [here](https://nodejs.org/en/download/) and npm can subsequently be installed using the instructions found [here](https://www.npmjs.com/get-npm)
4. Create the build directory by running the following command:
    * `npm run build`
5. Start the production server using the following command:
    * `serve -s build -p 8000`
    * Note: if you don't have serve already installed, then you can install serve using the following command: `npm install -g serve`
6. While the server is running in the background, browse the website at: [http://localhost:8000](http://localhost:8000)
### Development Mode
1. Download the repository.
2. Open a command prompt terminal and cd (change into the directory) where the repository has been saved.
3. Install all the needed npm dependencies using the following command:
    * `npm install`
    * Note: node.js can be downloaded [here](https://nodejs.org/en/download/) and npm can subsequently be installed using the instructions found [here](https://www.npmjs.com/get-npm)
4. Start the development server using the following command:
    * `npm start`
5. While the server is running in the background, browse the website at: [http://localhost:3000](http://localhost:3000)

## Minimum Requirements
The minimum requirements of this project involved:
* Creating a good interface design by:
  * Making the website responsive by:
    * Ensuring the website’s content is always visible and displays nicely on various sized devices including desktop, tablet, and mobile devices.
    * Making the images responsive in terms of size of the image vs. size of the viewport without overlapping or intruding upon other elements on the page.
    * Making sure that all application elements are visible and usable on all viewport sizes.
    * Adjusting font sizes and line heights to comfortable levels depending on the size of the device.
  * Making sure that each of the web app components are usable across various sized devices including desktop, tablet, and mobile devices.
* Implementing the following functionalities in the web app:
  * A location filter that consists of a text input field or a dropdown menu. This should simultaneously filter the location list items and the map markers based on the input provided without creating any errors.
  * A list view which:
    * Displays a list of names of all the locations by default. This list should contain at least five locations (either hard coded or retrieved using an API).
    * Displays only filtered locations when any filters are applied.
    * When the user clicks a list item in the list view, this should simultaneously display unique information regarding the associated location and animate the associated map marker on the map (such as by bouncing the marker or changing its color).
    * Displays responsively.
    * Does not create any errors.
  * A map with markers such that:
    * The map shows a marker for each location by default.
    * At least five locations are shown by default (either hard coded or retrieved using an API).
    * When a filter is applied, the map should only show markers of the filtered locations.
    * When the user clicks on a marker, unique information regarding the associated location should be shown on the page (such as in the form of a modal, in an info window, or in a separate div).
    * Extra custom functionality associated with the map does not create any errors.
* Retrieving and using asynchronous data such that:
  * The Google Maps API or another mapping system is used to display a map with markers.
  * Another third-party API not associated with Google is also used.
  * Each data request is made asynchronously by using XMLHttpRequest or the Fetch API.
  * A fallback technique is used to gracefully handle any errors resulting from trying to retrieve data so that a component in the web app doesn't appear broken and the user is given a visual indicator that an API wasn't able to load.
* Writing good documentation by:
  * Creating a README file with easy to understand instructions on how to install and start the project.
  * Writing detailed comments in the code where appropriate to explain longer pieces of code.
* Adding details for each location such that:
  * A third-party API is used to retrieve and add display extra information about a location.
  * Extra information about a location is shown in the associated marker's info window or in an `HTML` element in the `DOM` (such as in a modal, in a sidebar, or in the list view).
  * Properly attribute where extra information is coming from in:
    * the web app's UI.
    * the README file.
  * This aspect of the web app does not create any erros.
  * Extra information about a location is displayed responsively and in a usable manner.
* Making the website accessible by:
  * Managing focus appropriately so that users can easily and noticeably tab through all the important elements on the webpage.
  * Ensuring that focus is only trapped where necessary and is otherwise escapable (such as in modals and interstitial windows).
  * Ensuring that semantic elements are used wherever appropriate.
  * Using ARIA roles for those elements that do not have a proper semantic element to define themselves.
  * Ensure that all content-related images come with suitable alternate text which properly describes the contents of these images.
* Making the website available offline such that:
  * In browsers that support service workers, the web app registers and makes use of a service worker to cache the responses returned from the requests made for the site’s assets so that when there is no network access, the user can view any previously visited pages/content easily while offline.
* Using React properly by:
  * Using an appropriate component hierarchy.
  * Managing state properly by:
    * Passing event handlers as props to child components.
    * Using parent component's functions to manage state when need be.
  * Following best practices according to React's documentation (e.g. using a key for list items).
  * Ensuring that all code is functional and formatted appropriately.
* Ensuring that the web app runs without any errors and without any warnings.

## Extra Features
Extra features that were added to the web app included doing the following:
* Made the site accessible, such as by:
  * Using a color palette with high enough contrasts between the text and background color combinations to meet Web Content Accessibility Guidelines (WCAG) Criterion 1.4.6 so that users with lower visual acuity may still be able to read the content on the website.
  * Presenting information through means not only involving color in order to take into consideration those who are color blind. Examples included:
    - Underlining the text in buttons, text input boxes, and select dropdowns upon hover/focus.
    - Changing the stroke thickness of  buttons, text input boxes, and select dropdowns upon hover/focus.
  * Ensuring that all content-related images come with suitable alternate text which properly describes the contents of these images.
  * Ensuring that all content-related inline SVGs come with suitable titles which properly describe the contents of these SVGs.
  * Ensuring that all headings are detailed so that their purpose can be easily when headings are used as stand alone landmarks on a page by screen readers.
  * Ensuring that all links have a descriptive text or label so that their purpose can be easily when links are used as stand alone landmarks on a page by screen readers.
  * Using semantic elements wherever appropriate.
  * Using ARIA roles for elements that did not have a proper semantic element to define themselves.
  * Using labels and ARIA labels where appropriate.
  * Managing focus appropriately so that users can easily and noticeably tab through all the important elements on the webpage.
  * Trapping focus only where necessary, such as in the modal, and ensuring that focus is otherwise escapable.
* Made the Google Maps instance more accessible by:
  * Creating a custom map marker class based on the Google Maps API instead of using the built in map markers.
    * This was because the map markers were inaccessible. A user can click on Google's built in map markers to open info windows, but a user cannot access these map markers with a keyboard.
    * The custom map marker creates the markers as SVG buttons so that they are easily accessible by both mouse and keyboard and so that semantic elements are used instead of just plain images.
  * Creating a custom map info window class based on the Google Maps API instead of using the built in info windows.
    * This was because:
      * Opening the info window does not immediately move focus into the info window.
      * The order of the contents inside the info window was a little illogical when looking at the info window in the DOM.
      * There was a lack of appropriate semantic elements and ARIA descriptors regarding the info window and its contents.
    * The custom info window:
      * Moves focus immediately into the info window if it was opened by clicking on a map marker.
      * Uses a DOM order that matches the visual order of the contents inside the info window.
      * Uses semantic elements and appropriate ARIA descriptors to describe the info window and its contents.
* Added a modal to display helpful information about the web app with some useful links for more information.
* Added a loading icon while the Google Maps API's script is being retrieved.
* Added two different options to filter the location list items and map markers by name or by location category.
* Used the picture element with a srcset and sizes attributes for each image so that the resolution of the image uploaded is dependent upon the device pixel ratio of the user’s device and the current viewport size in order to load images at a faster rate.
* Customized Create React App's built in service worker by:
  * Displaying notifications to the user about:
    * When the user is currently offline or goes offline, then the user is notified that they are currently offline and that map functionality may be limited while offline. This notification is dismissable by the user and will automatically disappear once the user is back online.
    * When the service worker has installed and added all the desired resources for precaching and has activated (upon a second page refresh) and started caching other resources as the user interacts with the web app, then the user is notified that this web app may be viewable offline, but with limited map functionality. This notification is dismissable by the user and will disappear automatically after a few seconds.
    * When the service worker file has been updated a new service worker has installed and is waiting to activate, then the user is notified that a new version of the web app is available and the user is given the option to dismiss this notification or update the web app (which will refresh all open tabs of the website and let the new service worker take over). This notification is automatically hidden when the user goes offline though since an internet connection is required to update the website.
  * Building my own service worker file using the Workbox libraries. Create React App also uses the Workbox libraries using the webpack config method, but they do not allow developers to customize this config file. Hence, I created my own service worker using the workbox-build method (generating `build/sw.js`) instead of using Create React App's service worker (generated in `build/service-worker.js`). This enabled me to add the following functionalities to the service worker:
    * Create my own build files for production mode and development mode. (Create React App strictly does not allow building a service worker for development mode.)
    * Cache external resources as well as local resources.
      * Some external resources had CORS enabled by default, such as Google Fonts and the Foursquare API. But some external resources did not have CORS enabled by default even though they do allow it, such as the Google Maps API and images from Foursquare saved on a different server. In order to avoid generating and caching opaque responses which would utilize a lot of storage space very quickly and in order to understand whether the request was successful or not, I enabled cors by using the following work around:
        * intercepted the fetch request and add `mode: cors` to the header and
        * attached a proxy url to the begging of the fetch request's url as outlined in this [post on Stack Overflow](https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141#43881141).
      * Different APIs have different requirements regarding how long their resources can be cached. In order to follow the Terms of Services, I put a limit on how long a resource can be cached depending on the origin of the resource (1 day for Foursquare requests and 30 days for Google Maps requests). After this time limit has been reached, then the caches will automatically be purged.
    * Use different caching behaviors based on the origin of the request.
    * Place a limit on how many items from a specific origin can be cached so that older items are deleted from the cache if the limit has been reached. This was done in order to avoid using up too much of the user's storage space.
    * Enable automatic purging of particular caches if the user's storage space becomes limited.
    * Provide a fallback image if a Foursquare image request fails.
    * Delete old caches when the service worker updates.

## Project Structure
```bash
├── README.md - This file.
├── package.json # npm package manager file.
├── package-lock.json # npm package manager file.
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── images
└── src
    ├── API # Contains files with helper functions for using APIs.
    │   ├── defineCustomInfoWindowClass.js # Creates custom info window class for Google Maps.
    │   ├── defineCustomMapMarkerClass.js # Creates custom map marker class for Google Maps.
    │   ├── FoursquareAPI.js # Contains helper functions to simplify using the Foursquare API.
    │   └── loadGoogleMapsAPI.js # Promise that loads the Google Maps API script asynchronously.
    ├── App.css # Styles for the app.
    ├── App.js # Root of the app.
    ├── App.test.js # Used for testing.
    ├── components # Contains all custom components for building this app.
    │   ├── AboutModal.js
    │   ├── Header.js
    │   ├── LocationListItem.js
    │   ├── MapContainer.js
    │   ├── SearchByCategory.js
    │   ├── SearchByName.js
    │   ├── SearchForm.js
    │   ├── SearchResultsList.js
    │   └── SideBar.js
    ├── custom-workbox-sw # Contains files for building the service worker using Workbox libraries.
    │   ├── build-sw-dev.js # Build steps to generate a service worker with the precache manifest in the development directory to run in development mode.
    │   ├── build-sw-prod.js # Build steps to generate a service worker with the precache manifest in the build directory to run in production mode.
    │   └── sw.js # The initial service worker file before the precache manifest has been injected.
    ├── data # Contains hard coded starting data for each location.
    ├── icons # Contains helpful images for the app.
    ├── index.css # Global styles.
    ├── index.js # Used for DOM rendering.
    ├── mapStyles.js # Styling rules for the Google Maps instance.
    └── serviceWorker.js # Registers and controls the service worker.
```

## Resources Used
* Libraries/Toolchains
  * [Create React App](https://github.com/facebook/create-react-app)
  * [Workbox libraries]( https://developers.google.com/web/tools/workbox/)
* APIs
  * [Google Maps API]( https://developers.google.com/maps/documentation/javascript/tutorial)
  * [Foursquare API](https://developer.foursquare.com/places-api)
* Packages
  * [prop-types npm package](https://www.npmjs.com/package/prop-types)
  * [axios](https://www.npmjs.com/package/axios)
  * [axios-cancel](https://www.npmjs.com/package/axios-cancel)
* Guides
  * [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
  * [Accessible Rich Internet Applications (WAI-ARIA) 1.1](https://www.w3.org/TR/wai-aria-1.1/)
  * [A More Modern Scale for Web Typography](http://typecast.com/blog/a-more-modern-scale-for-web-typography)
  * [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
  * [Accessible SVGs](https://css-tricks.com/accessible-svgs/)
* Assets
  * [Material UI Icons](https://www.materialui.co/icons)
  * [Open Source Loading GIF Icons](https://www.behance.net/gallery/31234507/Open-source-Loading-GIF-Icons-Vol-1)
  * [Offline image](https://auth0.com/blog/introduction-to-progressive-apps-part-one/)
* Tutorials
  * [Connecting Foursquare](https://www.youtube.com/watch?v=Dj5hzKBxCBI&t=682s&list=PL4rQq4MQP1crXuPtruu_eijgOUUXhcUCP&index=4)
  * [Google Maps With React JS](https://www.youtube.com/watch?v=5J6fs_BlVC0&feature=youtu.be)
* Service Workers
  * [Guidelines for Customizing Workbox in Create React App](https://github.com/facebook/create-react-app/issues/5673#issuecomment-438654051)
  * [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers/)
  * [Udacity's Offline First Course](https://github.com/jakearchibald/wittr)
  * [Best practices for cleaning up old caches](https://github.com/GoogleChrome/workbox/issues/1407)
  * [How to use a CORS proxy to get around “No Access-Control-Allow-Origin header” problems](https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141#43881141)
  * [CORS Anywhere Repository](https://github.com/Rob--W/cors-anywhere/)
  * [Custom Callback to Handle and Modify Fetch Responses with Workbox](https://github.com/GoogleChrome/workbox/issues/938#issuecomment-409662987)
  * [Advanced Workbox Recipes](https://developers.google.com/web/tools/workbox/guides/advanced-recipes)
  * [Indicating Offline](https://justmarkup.com/log/2016/08/indicating-offline/)
* Modals
  * [Modal Window Effects](https://tympanus.net/Development/ModalWindowEffects/)
  * [Implementing a Simple Modal Component in React](https://alligator.io/react/modal-component/)
  * [Building an accessible Modal component with React Portals](https://assortment.io/posts/accessible-modal-component-react-portals-part-1)
  * [Google and Udacity course on Accessibility: Building an Accessible Modal Dialog](https://github.com/udacity/ud891/tree/gh-pages/lesson5-semantics-aria/21-dialog)
* Google Maps
  * [Udacity's Google Maps APIs course](https://github.com/udacity/ud864)
  * Custom Map Markers
    * [How to Create Custom HTML Markers on Google Maps](https://levelup.gitconnected.com/how-to-create-custom-html-markers-on-google-maps-9ff21be90e4b)
    * [Buttons with custom shapes](https://travishorn.com/buttons-with-custom-shapes-cabdcde7dfd1)
    * [Google Maps interactive SVG overlay](https://codepen.io/Sphinxxxx/pen/wjEyMm?editors=0100)
  * Custom Info Windows
    * [Custom Popups](https://developers.google.com/maps/documentation/javascript/examples/overlay-popup)
    * [Snazzy Info Window](https://github.com/atmist/snazzy-info-window/blob/master/src/snazzy-info-window.js)
    * [CSS Triangle](https://css-tricks.com/snippets/css/css-triangle/)
* Location Descriptions
  * [Unexpected Abu Dhabi: 42 places you didn’t know about](http://www.adwonline.ae/unexpected-abu-dhabi-42-places-you-didnt-know-about/amp/)
  * [The best hidden gems in Abu Dhabi](https://www.timeoutabudhabi.com/aroundtown/features/79594-the-best-hidden-gems-in-abu-dhabi)
  * [The ideal Abu Dhabi day](https://www.timeoutabudhabi.com/things-to-do/387076-the-ideal-abu-dhabi-day)
  * [Abu Dhabi Is Buzzing With Many Cool Cafes Concepts](http://www.abudhabiconfidential.ae/food-and-drinks/many-cool-new-cafes-in-abu-dhabi/)
  * [Grand Opening Of Qasr Al Hosn Cultural Site](http://www.abudhabiconfidential.ae/home-and-escape/grand-opening-of-qasr-al-hosn-cultural-site/)
  * [Yamanote Atelier Opens A Japanese Bakery Stall In Abu Dhabi](http://www.abudhabiconfidential.ae/food-and-drinks/yamanote-atelier-opens-japanese-bakery-stall-abu-dhabi/)
  * [Abu Dhabi experiences: 8 hidden gems to try](https://www.thenational.ae/lifestyle/abu-dhabi-experiences-8-hidden-gems-to-try-1.674122)
  * [11 of the best natural hidden gems in the UAE](https://gulfnews.com/lifestyle/community/11-of-the-best-natural-hidden-gems-in-the-uae-1.1883234)
  * [Sir Bani Yas Island Wildlife](http://www.sirbaniyasisland.com/Wildlife)
  * [Explore the best hidden gems in the capital with us](http://www.adwonline.ae/explore-best-hidden-gems-capital-us/amp/)
  * [11 Natural Hidden Gems in the UAE Worth Exploring](https://theculturetrip.com/middle-east/united-arab-emirates/articles/11-natural-hidden-gems-in-the-uae-worth-exploring/)
  * [TechShop](https://www.techshop.ae/about.html)
  * [Warehouse421](https://www.warehouse421.ae/en/)
  * [Dolmabahce](https://www.reserveout.com/abu-dhabi-en/dolmabahce-al-raha)
  * [Umm Al Emarat Park](https://visitabudhabi.ae/en/see.and.do/attractions.and.landmarks/family.attractions/mushrif.central.park.aspx)
  * [Parks and Gardens](https://visitabudhabi.ae/en/see.and.do/experiences/activities/parks.and.gardens.aspx)
  * [Al Wathba Cycle Track](https://www.sportinabudhabi.ae/compete/al-wathba-cycle-track/)
  * [Take a 360 degree tour of Abu Dhabi's Mina Fish Market](https://www.thenational.ae/uae/heritage/take-a-360-degree-tour-of-abu-dhabi-s-mina-fish-market-1.737582)
  * [Heritage Park](https://www.lonelyplanet.com/united-arab-emirates/abu-dhabi/attractions/heritage-park/a/poi-sig/1509545/361165)
  * [Traditional Markets & Souks](https://visitabudhabi.ae/en/see.and.do/shopping/traditional.markets.and.souks.aspx)
  * [The Mall At World Trade Centre Abu Dhabi](https://visitabudhabi.ae/en/see.and.do/shopping/shopping.malls/world.trade.center.souk.and.mall.aspx)
  * [Abu Dhabi residents to get to walk, jog around Yas Marina Circuit](https://www.khaleejtimes.com/nation/uae-health/abu-dhabi-residents-to-get-to-walk-jog-around-yas-marina-circuit)