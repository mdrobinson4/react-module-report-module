import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';



export default class PlotData extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let plotmode = 'markers'

    // Change plot mode to lines + markers if line graph
    if (this.props.data.type === 'line')
      plotmode = 'lines+markers'

    let trace1 = {
       x: this.props.data['xRecords']['values'],
       y: this.props.data['yRecords']['values'],
       mode: plotmode,
       marker: {
         size: this.props.data['size'],
          opacity: this.props.data['opacity']
        },
        line: {
          dash: 'solid',
          opacity: this.props.data['opacity'],
          width: this.props.data['size'] / 3,
          size: this.props.data['size']
        },
        type: this.props.data['graphType'],
    };

// if the datatypes are not categorical and switch is enabled make the traces be the name of the records
  if (this.props.data['xType'] !== 'categorical' && this.props.data['yType'] !== 'categorical' && this.props.data['switch']) {
    trace1.x = this.props.data['xRecords']['name'];
    trace1.y = this.props.data['xRecords']['name'];
    trace1.mode = 'markers';
  };

  let layout = {
    title: 'Graph',
    size: 100,
    width: this.props.data.height * 1.555555556,
    height: this.props.data.height,
    xaxis: {
      autotick: !this.props.data['showAllTicks'],
    }
}
//console.log(this.props.data);
  let data = [trace1];

    return (<Plot data={data} layout={layout}/>);
  }
}
