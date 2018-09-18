import React from 'react';
import Plot from 'react-plotly.js';
import PiSlider from './PieSlider';

export default class pie extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <input type="range" min="1" max="100" value="10">
      )
    }
  }
