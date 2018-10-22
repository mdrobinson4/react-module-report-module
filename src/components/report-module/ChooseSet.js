import React from 'react';
import update from 'immutability-helper';

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
      if(this.props.records) {
        options = this.props.records.map((element) =>
          <option key={element}>{element.toUpperCase()}</option>
        );
      }
      return (
        <div>
          <select onChange={this.props.handleSetChange}>{options}</select>
        </div>
      )
    }
  }
