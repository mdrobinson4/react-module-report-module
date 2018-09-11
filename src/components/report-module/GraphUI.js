import React from 'react';
import PropTypes from 'prop-types';
import PlotData from './PlotData';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import { Dropdown } from '@folio/stripes-components/lib/Dropdown';
import Button from '@folio/stripes-components/lib/Button';
import DropdownMenu from '@folio/stripes-components/lib/DropdownMenu';
import { Grid, Row, Col } from '@folio/stripes-components/lib/LayoutGrid';

import css from './style.css';

// Returns the graphical interce and sends the fields' values to PLOTLY
export default class GraphUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvName: this.props.records.name,
      xRecords: {name: '', values: this.props.records.data[Object.keys(this.props.records.data)[0]]}, // X
      yRecords: {name: '', values: this.props.records.data[Object.keys(this.props.records.data)[0]]}, // Y
      zRecords: {name: '', values: []},  // Z
      xType: 'categorical',
      yType: 'categorical',
      size: 20,
      height: 1165,
      //width: 700,
      graphType: 'bar',
      switch: true,
      frequency: true,
      showAllTicks: '',
      opacity: 1

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
        values: this.props.records.data[event.target.value],
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
    // Creates the option elements for the graph types
    const graphType = ['bar', 'line', 'pie'];
    let graphTypeOp = graphType.map((type) =>
      <option key={type} value={type}>{type.toUpperCase()}</option>
    );

    // Creates the option elements for each row of data
    const keys = Object.keys(this.props.records.data);
    let columns = keys.map((col) =>
      <option type="button" key={col} value={col} >{col.toUpperCase()}</option>
    );

    // Creates the option elements for data types
    const dataType = ['continuous', 'categorical'];
    let dataTypeOp = dataType.map((type) =>
      <option key={type} value={type}>{type.toUpperCase()}</option>
    );

    return (
      <div className={css.container}>
      <div className={css.userInterface} >

          <h4>X-Axis:</h4>
          <select name="xRecords" onChange={this.handleAxisChange}>
            {columns}
          </select>

          <h4>Y-Axis:</h4>
          <select name="yRecords" onChange={this.handleAxisChange}>
            {columns}
          </select>

          <div>
            <h4>DataType: </h4>
            <select name="dataType" onChange={this.handleUIChange}>
              {dataTypeOp}
            </select>
          </div>

        <div className={css.gType}>
          <h4>Graph Type:</h4>
          <select name="graphType" onChange={this.handleUIChange}>
            {graphTypeOp}
          </select>
        </div>

        <form>
          <div className={css.checkbox}>
            <Checkbox name="frequency" label="Frequency" value={this.state.frequency.toString()} onChange={this.handleUIChange} />
            <Checkbox name="showAllTicks" label="Show All X-Ticks" value={this.state.showAllTicks} onChange={this.handleUIChange} />
            <Checkbox name="opacity" label="Opacity" value={this.state.opacity} onChange={this.handleUIChange} />
            <Checkbox name="switch" label="Switch" value={this.state.switch} onChange={this.handleUIChange} />
          </div>
          <div className={css.range}>
            <label>Size: {this.state.size} </label><br />
            <input type="range" name="size" min="1" max="2000" value={this.state.size} className="form-control-range" onChange={this.handleUIChange} className={css.input}/><br />
          </div>
          <div className={css.range}>
            <label>Graph Size: {this.state.height} </label><br />
            <input type="range" name="height" min="1" max="2000" value={this.state.height} className="form-control-range" onChange={this.handleUIChange} className={css.input}/><br />
          </div>
        </form>

        </div>


      <div className={css.graph} >
        <PlotData data={this.state} className={css.plotlyStyle} />
      </div>

    </div>
    )
  }
}
