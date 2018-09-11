import React from 'react';
import Plot from 'react-plotly.js';



export default class PlotData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      graphData: this.props.data.graphData,
      axesType: this.props.data.axesType,
      switchAxes: this.props.data.switchAxes
    }
  }
  render() {
    return (
      <Plot
        data={this.state.graphData.data}
        layout={this.state.graphData.layout}
       />
    );
  }
}
