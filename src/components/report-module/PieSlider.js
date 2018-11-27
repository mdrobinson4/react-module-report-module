import React from 'react';

export default class PieSlider extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      console.log(this.props.value);
      if (this.props.size > 10) {
        return (
          <fieldset>
            <legend>Records Shown: {this.props.value}</legend>
            <input type="range" name="slices" min="1" max="100" value={this.props.value} onChange={this.props.handleNumChange} />
        </fieldset>
        )
      }
      else {
        return (
          <fieldset>
            <legend>Records Shown: {this.props.size}</legend>
        </fieldset>
        )
      }
    }
  }