import React from 'react';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Select from '@folio/stripes-components/lib/Select';
import css from './style.css';
//dataOptions={[
//  {value: "Y", label: "Yes"},
//  {value: "N", label: "No"},
//  {value: "M", label: "Maybe", disabled: true}
//]}>
// Returns the graphical interce and sends the fields' values to PLOTLY
export default class GraphUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xType: 'categorical',
      yType: 'categorical',
      size: 20,
      switch: true,
      frequency: true,
      showAllTicks: '',
      opacity: 1,
      xAxisCheckbox: false,
      yAxisCheckbox: false,
      xAxisValues: [
        {value: "A", label: "Yes"},
        {value: "B", label: "No"}
      ]
    };
    this.handleUIChange = this.handleUIChange.bind(this);
    this.handleAxisChange = this.handleAxisChange.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }

  toggleCheckbox(e) {
    let boxState = {}

    boxState[e.target.name] = e.target.value
    this.setState(boxState)
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
    //// Creates the option elements for the graph types
    //const graphType = ['bar', 'line', 'pie'];
    //let graphTypeOp = graphType.map((type) =>
    //  <option key={type} value={type}>{type.toUpperCase()}</option>
    //);
//
    //// Creates the option elements for each row of data
    //const keys = Object.keys(this.props.records.data);
    //let columns = keys.map((col) =>
    //  <option type="button" key={col} value={col} >{col.toUpperCase()}</option>
    //);
//
    //// Creates the option elements for data types
    //const dataType = ['continuous', 'categorical'];
    //let dataTypeOp = dataType.map((type) =>
    //  <option key={type} value={type}>{type.toUpperCase()}</option>
    //);

    return (
      <div>
        <div className={css.ui}>
          <div className={css.axisControl}>

            <Checkbox name="xAxisCheckbox" label="X-Axis" onChange={this.toggleCheckbox} value={this.state.xAxisCheckbox}/>
            <Checkbox name="yAxisCheckbox" label="Y-Axis" onChange={this.toggleCheckbox} value={this.state.yAxisCheckbox}/>
          </div>
        </div>
      </div>
    )
  }
}
