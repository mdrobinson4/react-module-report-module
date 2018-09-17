import React from 'react';
import Plot from 'react-plotly.js';



export default class PlotData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }
  render() {
    return (
      <Plot
        data={this.props.graph.data}
        layout={this.props.graph.layout}
       />
    );
  }
}
