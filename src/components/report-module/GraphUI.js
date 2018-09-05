import React from 'react';
import PropTypes from 'prop-types';
import PlotData from './PlotData';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import { Dropdown } from '@folio/stripes-components/lib/Dropdown';
import Button from '@folio/stripes-components/lib/Button';
import DropdownMenu from '@folio/stripes-components/lib/DropdownMenu';

import { Grid, Row, Col } from '@folio/stripes-components/lib/LayoutGrid';


export default class ResponsiveGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      // Will eventually be an array of objects with the values, names, and types
      xRecords: {name: '', values: []}, // X
      yRecords: {name: '', values: []}, // Y
      zRecords: {name: '', values: []},  // Z
      xType: 'categorical',
      yType: 'categorical',
      size: 20,
      height: 0,
      width: 0,
      graphType: 'bar',
      switch: true,
      frequency: true,
      showAllTicks: '',
      opacity: 1,

    };
    this.handleUIChange = this.handleUIChange.bind(this);
    this.handleAxisChange = this.handleAxisChange.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }


onToggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleAxisChange(event) {
    this.setState({
      [event.target.name]: {
        values: this.props.records[event.target.value],
        name: event.target.value
      }
    });
  }

  handleUIChange(event) {
  this.setState({
    [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
  });
}

  render() {
    console.log(this.state);

    const graphType = ['bar', 'line', 'pie'];
    let graphTypeOp = graphType.map((type) =>
      <option key={type} value={type}>{type.toUpperCase()}</option>
    );

    const keys = Object.keys(this.props.records);
    let columns = keys.map((col) =>
      <option type="button" key={col} value={col} >{col.toUpperCase()}</option>
    );

    //<Button type="button" key={col} value={col} >{col.toUpperCase()}</Button>

    const dataType = ['continuous', 'categorical'];
    let dataTypeOp = dataType.map((type) =>
      <option key={type} value={type}>{type.toUpperCase()}</option>
    );

    // Styling

    const App = {
      display: "grid",
      gridTemplateColumns: "repeat(2, auto)",
      gridAutoRows: "auto",
      justifyItems: "start",
      justifyContent: "start",
      textAlign: "left",
      textTransform: "uppercase"
    };

    const ui = {
      gridColumn: 1 / 1,
      justifySelf: "start",
      alignSelf: "center",
      marginLeft: 5
    };

    const graph = {
      gridColumn: 2 / 3
    };

    const axisControl = {
      display: "inline-block",
      paddingRight: ".2em"
    };

    const checkbox = {
      margin: "1em",
      textAlign: "left"
    };

    const input = {
      margin: ".7em"
    };

    const gType = {
      margin: "1em"
    };

    const range = {
      textAlign: "center"
    };

    const plotlyStyle = {
      'padding': '1em'
    };

    return (

<div>

            <div style={App}>

            <div style={ui} >


                <div className="axis">

                <h4>X-Axis:</h4>

                <div style={axisControl}>
                  <label>Data: </label><br />
                  <select name="xRecords" onChange={this.handleAxisChange}>
                    {columns}
                  </select>
                  </div>

                  <div style={axisControl}>
                    <label>Datatype: </label><br />
                    <select name="dataType" onChange={this.handleUIChange}>
                      {dataTypeOp}
                    </select>
                  </div>

                  <h4>Y-Axis:</h4>

                  <div style={axisControl}>
                    <label>Data: </label><br />
                    <select name="yRecords" onChange={this.handleAxisChange}>
                      {columns}
                    </select>
                    </div>

                  <div style={axisControl}>
                    <label>Datatype: </label><br />
                    <select name="dataType" onChange={this.handleUIChange}>
                      {dataTypeOp}
                    </select>
                  </div>

                </div>

                <div style={gType}>
                  <label>Graph Type: </label>
                  <select name="graphType" onChange={this.handleUIChange}>
                    {graphTypeOp}
                  </select>
                </div>


                <form>

                  <div>
                    <div style={checkbox}>

                      <Checkbox name="frequency" label="Frequency" value={this.state.frequency} onChange={this.handleUIChange} />

                      <Checkbox name="showAllTicks" label="Show All X-Ticks" value={this.state.showAllTicks} onChange={this.handleUIChange} />

                      <Checkbox name="opacity" label="Opacity" value={this.state.opacity} onChange={this.handleUIChange} />

                      <Checkbox name="switch" label="Switch" value={this.state.switch} onChange={this.handleUIChange} />

                    </div>
                  </div>

                  <div style={range}>
                    <label>Size: {this.state.size} </label><br />
                    <input type="range" name="size" className="form-control-range" onChange={this.handleUIChange} style={input}/><br />
                  </div>
                </form>
            </div>

        <div style={graph} >
          <PlotData data={this.state} style={plotlyStyle}/>
        </div>
        </div>
        </div>
    )
  }
}
