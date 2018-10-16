import React from 'react';
import update from 'immutability-helper';

/*
  JARGON -> (1) d2Index --- first set of data (array of values) selected (2) d3Index --- Second set of data (array of values) selected
  For every element in the array at d2Index, Find another element in the array at d3Index.
  Each chart represents each (unique) item in the array at d2Index.
*/

export default class ChooseSet extends React.Component {
    constructor(props) {
      super(props);
      this.state = {

      }
    }

    chooseSet = () => {
      const listItems = this.props.records.map((element) =>
      <option key={element}>{element}</option>
    );
    return listItems;
    }

    render() {
      let options;
      console.log(this.props.records);
      if(this.props.records.length) {
        options = this.props.records[this.props.d3Index].map((element) =>
          <option key={element} value={element}>{element.toUpperCase}</option>
        );
      }

    console.log(options);
      return (
        <div>
          <select onChange={this.props.handleSetChange}>{options}</select>
        </div>
      )
    }
  }
