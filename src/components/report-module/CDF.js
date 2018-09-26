import React from 'react';
import PropTypes from 'prop-types';
import Select from '@folio/stripes-components/lib/Select';
import Plot from 'react-plotly.js';

export default class CDF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      layout: {}
    };

    // In the final project, the specified values will be stored in this.props.values
    this.values = this.props.records[Object.keys(this.props.records)[0]];
  }

  componentDidMount() {
    this.createCDF();
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.values !== prevState.data.x) && prevState.data.x)  // Only rerender if the values or layout changed
      this.createCDF();
  }


  createCDF = () => {
    let data = [
    {
      x: this.values,
      type: 'histogram',
      cumulative: {
        enabled: true
      }
    }
  ];

    let layout = {
      title: this.props.title,
      autosize: true
    };

    this.updateState(data, layout); // Set the state with the current data and layout variables
  }

  updateState = (data, layout) => {
    this.setState({
      data: data,
      layout: layout
    });
  }

  render() {
    return (
      <Plot
        data={this.state.data}
        layout={this.state.layout}
      />
    )
  }
}
