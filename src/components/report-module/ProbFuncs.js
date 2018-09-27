import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Plot from 'react-plotly.js';

export default class ProbFuncs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:
        {
          x: this.props.records[Object.keys(this.props.records)[0]],      // In the FUTURE, the specified values will be stored in this.props.values
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
      type: 'cdf',
    };
  }

  handleResize = (e) => {
    let layout = this.state.layout;
    layout.width = window.innerWidth / 2;
    layout.height = .6428571429 * layout.width;

    if (layout.height > window.innerHeight) {
      layout.height = window.innerHeight;
      layout.width = 1.55556 * layout.height;
    }
    this.updateLayout(layout);
  }

  updateLayout = (layout) => {
    this.setState({
      layout: layout
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.values !== prevProps.values)  && prevState.data.x)  // render if the VALUES are changed
      this.updateValues();

    if (this.props.type !== prevProps.type  && prevState.data.x)  // render if the TYPE is changed
      this.updateType();
  }

    // Update the values and RESET the other options -> [cumulative, histonorm, type]
    updateValues = () => {
      this.setState((prevState) => ({
        data: {
          x: this.props.records[Object.keys(this.props.records)[0]],  // In the FUTURE, the specified values will be stored in this.props.values
          cumulative: {enabled: true},
          histonorm: '',
          marker: {}
        },
        type: 'cdf'
      }));
    }

    // Update the type and SET the other options -> [cumulative, histonorm, marker]
    updateType = () => {
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

    // Update the function if the NORMALIZE value is changed
    handleNormChange = (e) => {
      let newNormVal = (e.target.value === 'false') ? 'true' : 'false'; // Since the checkbox component only takes strings
      let data = this.state.data;

      if (newNormVal === 'true') {
        data.histonorm = 'probability';
        data.marker.color = 'rgb(255, 255, 100)';
      }

      else {
        data.histonorm = '';
        data.marker.color = '';
      }

      this.updateState(data, newNormVal);
    }

    updateState = (data, normalized) => {
      this.setState({
        data: data,
        normalized: normalized
      });
    }

  render() {
    console.log(this.state.data);
    console.log(`Window Width: ${this.state.windowWidth}`);
    let normCheckBox = (this.state.type === 'pdf') ? <Checkbox name="normalized" label="Normalized" onChange={this.handleNormChange} value={this.state.normalized}/> : null;
    return (
      <div>
        {normCheckBox}
        <Plot
          data={[this.state.data]}
          layout={this.state.layout}
        />
      </div>
    )
  }
}
