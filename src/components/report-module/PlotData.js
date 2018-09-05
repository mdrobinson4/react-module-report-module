import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';



export default class ShowGraph extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let xAxis=this.props.data['xRecords']['values'];
    let yAxis=this.props.data['yRecords']['values'];
    let xAxisName = this.props.data['xRecords']['name'];
    let yAxisName = this.props.data['yRecords']['name'];
    let size = this.props.data['size'];
    let opacity = this.props.data['opacity'];
    let xType = this.props.data['xType'];
    let yType = this.props.data['yType'];
    let Switch = this.props.data['switch'];
    let graphType = this.props.data['graphType'];
    let ShowAllXTick = this.props.data['showAllTicks'];
    let plotmode = 'markers'

    if (opacity) {
      opacity = true;
    }
    else {
      opacity = false;
    }
    if (this.props.data.type === 'line')
      plotmode = 'lines+markers'

    let trace1 = {
       x: xAxis,
       y: yAxis,
       mode: plotmode,
       marker: {
         size: size,
          opacity: opacity
        },
        line: {
          dash: 'solid',
          opacity: opacity,
          width: size / 3,
          size: size
        }
    };

  if (xType !== 'categorical' && yType !== 'categorical') {
    if (Switch === true) {
      xAxis = xAxisName;
      yAxis = yAxisName;
      trace1 = {
        x: xAxis,
        y: yAxis,
        mode: plotmode,
        marker: {
          size: size,
          opacity: opacity
        },
        line: {
          dash: 'solid',
          opacity: opacity,
          width: size / 3
        }
      };
    };
  };

  let layout = {
    xAxis: {
      autotick: !ShowAllXTick
        }
    };
  if (graphType === 'bar') {
    trace1.type = 'bar'
  }
  let data = [trace1];


    return (
      <Plot
        data={data}
        layout={layout}
       />
    );
  }
}
