import React from 'react';
import Button from '../Button';
import DataOptions from '../DataOptions'
import Slider from '../Slider'
import Dropdown from '../Dropdown';
import SetDropdown from '../SetDropdown';
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
              values={(Object.keys(this.props.data))}
              changeSet={this.props.changeSet}
            />
            <DataOptions
              updateLabel={this.props.updateLabel}
              checkboxData={this.props.checkboxData}
              updateGraph={this.props.updateGraph}
              getCount={this.props.getCount}
              getFreq={this.props.getFreq}
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
