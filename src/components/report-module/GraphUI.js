import React from 'react';
import Button from './Button';
import DataOptions from './DataOptions'
import Slider from './Slider'
import Dropdown from './Dropdown';
import SetDropdown from './SetDropdown';
import css from './GraphUI.css';

/*
  GraphUI works as a wrapping component for all components that change the size, opacity, data, etc. of the graph
*/
export default class GraphUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValues: {
        opacity: {
          min: 1,
          max: 100,
          defaultValue: 100
        },
        graphSize: {
          min: 50,
          max: 150,
          defaultValue: 100
        }
      }
    };
  }

  render() {
    return (
      <div>
        <div>
          <div className={css.axisControl}>
            <SetDropdown
              label={'Dataset'}
              values={this.props.sets}
              changeSet={this.props.changeSet}
            />
            <DataOptions
              axisData={this.props.axisData}
              changeAxis={this.props.changeAxis}
              getCount={this.props.getCount}
              getFreq={this.props.getFreq}
            />
            <Button
              label={"Switch Axes"}
              onClick={this.props.swapAxes}
            />
            <Slider
              label={"Opacity"}
              properties={this.state.sliderValues.opacity}
              updateValue={this.props.updateOpac}
            />
            <Slider
              label={"Graph Size"}
              properties={this.state.sliderValues.graphSize}
              updateValue={this.props.updateSize}
            />
            <Dropdown
              label={"Graph Type"}
              changeType={this.props.changeType}
            />
          </div>
        </div>
      </div>
    )
  }
}
