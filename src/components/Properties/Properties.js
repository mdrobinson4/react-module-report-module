import React from 'react';
import Slider from '../Slider';

export default class Propeties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
      return (
        <div>
          <Slider
            label={"Opacity"}
            onChange={this.props.setOpacity}
            setOpacity={this.props.setOpacity}
            default={100}
            max={100}
            min={1}
          />
          <Slider
            label={"Graph Size"}
            onChange={this.props.setSize}
            max={150}
            min={50}
            default={100}
            width={this.props.width}
            handleWindowResize={this.props.handleWindowResize}
          />
        <div/>
        );
    }
}
