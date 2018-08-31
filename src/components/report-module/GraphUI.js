import React from 'react';
import PropTypes from 'prop-types';
import PlotData from './PlotData';


export default class ResponsiveGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      <option key={col} value={col}>{col.toUpperCase()}</option>
    );

    const dataType = ['continuous', 'categorical'];
    let dataTypeOp = dataType.map((type) =>
      <option key={type} value={type}>{type.toUpperCase()}</option>
    );

    // Styling

    const App = {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gridAutoRows: "auto",
      justifyItems: "center",
      justifyContent: "space-around",
      textAlign: "center",
      textTransform: "uppercase"
    };

    const ui = {
      gridColumn: 1 / 1,
      justifySelf: "center",
      alignSelf: "center"
    };

    const graph = {
      gridColumn: 2 / 3
    };

    const axisControl = {
      display: "inline-block",
      paddingRight: ".2em"
    };

    const checkbox = {
      margin: "1em"
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

    return (
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
                    <div style={checkbox} >
                      <label >Frequency</label>
                      <input type="checkbox" name="frequency" value={this.state.frequency}  onChange={this.handleUIChange} style={input} /><br />
                    </div>
                    <div style={checkbox} >
                      <label>Show All X-Ticks</label>
                      <input type="checkbox" name="showAllTicks" value={this.state.showAllTicks} onChange={this.handleUIChange} style={input}/><br />
                    </div>
                    <div style={checkbox} >
                      <label>Opacity</label>
                      <input type="checkbox" name="opacity" value={this.state.opacity} onChange={this.handleUIChange} style={input}/><br />
                    </div>
                    <div style={checkbox} >
                      <label>Switch</label>
                      <input type="checkbox" name="switch" value={this.state.switch} onChange={this.handleUIChange} style={input}/><br />
                    </div>
                  </div>

                  <div style={range}>
                    <label>Size: {this.state.size} </label><br />
                    <input type="range" name="size" className="form-control-range" onChange={this.handleUIChange} style={input}/><br />
                  </div>
                </form>
            </div>

        <div style={graph} >
          <PlotData data={this.state}/>
        </div>
        </div>
    )
  }
}
