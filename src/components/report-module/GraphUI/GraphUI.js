import React from 'react';
import Button from './Button';
import DataOptions from './DataOptions'
import Slider from './Slider'
import Dropdown from './Dropdown';
import SetDropdown from './SetDropdown';
import css from './GraphUI.css';

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
    this.getCount = this.getCount.bind(this);
  }

  getCount(arr) {
    var lastElement = arr[0];
    var count = 1;

    var countArr = [];

    for (var x = 1; x <= arr.length; x++) {
        if (arr[x] === lastElement) {
            count++;
        }
        else {
            countArr.push(count);
            count = 1;
            lastElement = arr[x];
        }
    }
    return countArr;
  }

  getFrequency(arr) {

    var lastElement = arr[0];
    var count = 1;
    var percentOf;

    var freqArr = [];

    for (var x = 1; x <= arr.length; x++) {
      if (arr[x] === lastElement) {
        count++;
      }
      else {
        percentOf = count / arr.length;
        freqArr.push(percentOf);

        count = 1;
        lastElement = arr[x]
      }
    }

    return freqArr;
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
              getCount={this.getCount}
              getFreq={this.getFrequency}
              name={this.props.name}
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
              width={this.props.width}
              updateSize={this.props.updateSize}
              x={this.props.x}
            />
            <Dropdown
              label={"Graph Type"}
              values={this.props.values}
              changeType={this.props.changeType}
            />
          </div>
        </div>
      </div>
    )
  }
}
