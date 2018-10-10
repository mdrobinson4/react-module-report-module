import React from 'react';
import Button from './Button';
import DataOptions from './DataOptions'
import Slider from './Slider'
import Dropdown from './Dropdown';
import css from './style.css';

export default class GraphUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xType: 'categorical',
      yType: 'categorical',
      size: 20,
      showAllTicks: '',
      opacity: 1
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
        <div className={css.ui}>
          <div className={css.axisControl}>
            <DataOptions
              axisData={this.props.axisData}
              changeAxis={this.props.changeAxis}
              getCount={this.getCount}
              getFreq={this.getFrequency}
            />
            <Button
              label={"Switch Axes"}
              onClick={this.props.swapAxes}
            />
            <Slider
              label={"Opacity"}
              updateValue={this.props.updateOpac}
            />
            <Slider
              label={"Graph Size"}
              updateValue={this.props.updateSize}
            />
            <Dropdown
              changeType={this.props.changeType}
            />
          </div>
        </div>
      </div>
    )
  }
}
