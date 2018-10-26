import React, { Component } from 'react';
import './App.css';
import * as FoursquareAPI from './API/FoursquareAPI.js';

class App extends Component {
  componentDidMount() {
    /*
    FoursquareAPI.searchForVenues({
      near: 'Abu Dhabi,UAE',
      query: 'parks',
      limit: 10
    }).then((results) => {
      console.log('Results: ');
      console.log(results);
    });
    */
  }

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
