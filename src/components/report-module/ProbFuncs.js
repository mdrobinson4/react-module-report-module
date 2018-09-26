import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Select from '@folio/stripes-components/lib/Select';
import Plot from 'react-plotly.js';

export default class ProbFuncs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:
        {
          x: this.props.records[Object.keys(this.props.records)[0]],      // In the FUTURE project, the specified values will be stored in this.props.values
          type: 'histogram',
          cumulative: {enabled: true},
          histonorm: '',
          marker: {color: ''}
        },
      layout: {
        title: this.props.title,
        autosize: true
      },
      normalized: 'false',
      type: 'cdf'
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.values !== prevProps.values)  && prevState.data.x)  // render if the values are updated
      this.updateValues();

    if (this.props.type !== prevProps.type  && prevState.data.x)  // render if the type is upaded
      this.updateType();
  }

    // Update the values and reset the options -> [cumulative, histonorm, type]
    updateValues = () => {
      this.setState((prevState) => ({
        data: {
          x: this.props.records[Object.keys(this.props.records)[0]],
          type: 'cdf',
          cumulative: {enabled: true},
          histonorm: '',
          marker: {}
        }
      }));
    }

    // Update the type and set the other options -> [cumulative, histonorm, marker]
    updateType = () => {
      console.log('update type');
      this.setState((prevState) => ({
        data: {
          x: prevState.data.x,
          type: this.props.type,
          cumulative: (this.props.type === 'cdf') ? {enabled: true} : {enabled: false},
          histonorm: (this.props.type === 'cdf') ? '' : 'probability',
          marker: (this.props.type === 'cdf') ? {} : {color: 'rgb(255, 255, 100)'}
        },
        type: this.props.type
      }));
    }

    // Update the function if normalized is enabled
    handleNormChange = (e) => {
      let result = (e.target.value === 'false') ? 'true' : 'false';
      let data = this.state.data;

      if (result === 'true') {
        data.histonorm = 'probability';
        data.marker.color = 'rgb(255, 255, 100)';
      }

      else {
        data.histonorm = '';
        data.marker.color = '';
      }

      this.updateState(data, result);
    }

    updateState = (data, normalized) => {
      this.setState({
        data: data,
        normalized: normalized
      });
    }

  render() {
    console.log(this.state.data);
    let normalized = (this.state.type === 'pdf') ? <Checkbox name="normalized" label="Normalized" onChange={this.handleNormChange} value={this.state.normalized}/> : null;
    return (
      <div>
        {normalized}
        <Plot
          data={[this.state.data]}
          layout={this.state.layout}
        />
      </div>
    )
  }
}
