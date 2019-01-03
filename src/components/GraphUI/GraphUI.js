import React from 'react';
import Button from '../Button';
import DataOptions from '../DataOptions'
import Slider from '../Slider'
import Dropdown from '../Dropdown';
import SetDropdown from '../SetDropdown';
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
  }

  getCount = (arr) => {
    let lastElement = arr[0];
    let count = 1;
    let countArr = [];
    for (let x = 1; x <= arr.length; x++) {
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

  getFrequency = (arr) => {
    let lastElement = arr[0];
    let count = 1;
    let percentOf;
    let freqArr = [];
    for (let x = 1; x <= arr.length; x++) {
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
              values={(Object.keys(this.props.data))}
              changeSet={this.props.changeSet}
            />
            <DataOptions
              checkboxData={this.props.checkboxData}
              updateGraph={this.props.updateGraph}
              getCount={this.getCount}
              getFreq={this.getFrequency}
              name={this.props.name}
            />
            <Slider
              label={"Opacity"}
              properties={this.state.sliderValues.opacity}
              updateValue={this.props.setOpacity}
            />
            <Slider
              label={"Graph Size"}
              properties={this.state.sliderValues.graphSize}
              updateValue={this.props.updateSize}
            />
            <Dropdown
              label={"Graph Type"}
              values={this.props.values}
              changeType={this.props.changeGraphType}
            />
          </div>
        </div>
      </div>
    )
  }
}
