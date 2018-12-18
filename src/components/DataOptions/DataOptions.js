import React from "react";
import Button from '../Button';
import css from './DataOptions.css';
import update from 'immutability-helper';


export default class DataOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentAxes: {
                x: {
                    type: String,
                    values: [ ],
                    active: false
                },
                y: {
                    type: String,
                    values: [ ],
                    active: false
                }
            },
            currentLabel: 'Count',
            lastLabel: 'Frequency',
            freqActive: false,
            xDefaultValues: [],
            checked: true
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateAxis = this.updateAxis.bind(this);
        this.switchFreq = this.switchFreq.bind(this);
        this.removeDuplicates = this.removeDuplicates.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.name != this.props.name) {
        this.setState(update(this.state, {
          currentAxes: {
            x: {active: {$set: false}, type: {$set: null}, values: {$set: null}},   // Set Both X and Y Axis To Null
            y: {active: {$set: false}, type: {$set: null}, values: {$set: null}}
          },
          xDefaultValues: {$set: null}
        }), this.updateAxis);
      }
    }

    handleChange(event) {
        var target = event.target;

        var axis = {
            type: target.name,
            values: target.value,
            active: target.checked
        }
        let stateHolder = this.state.currentAxes;
        if (axis.active === true) {
          // Attempting to check third checkbox
          if (this.state.currentAxes.x.active === true && this.state.currentAxes.y.active === true) {
            // alert('DESELCT ONE FIRST!!');
            event.target.checked = false;
          }
          // Setting y axis
          else if (this.state.currentAxes.x.active === true) {
            this.setState(update(this.state, {
              currentAxes: {y: {$set: axis}},
              freqActive: {$set: false}
            }), this.updateAxis);
          }
          // Setting x axis
          else {
            this.setState(update(this.state, {
              xDefaultValues: {$set: axis.values},
              currentAxes: {x: {$set: axis}},
              freqActive: {$set: true}
            }), this.updateAxis);
          }
        }
        // Deselected a checkbox
        else if (axis.active === false) {
          // Both X and Y Axis Are Set
          if (this.state.currentAxes.x.active === true && this.state.currentAxes.y.active === true) {
            let newXaxis = [];
            // Deselected X Axis
            if (axis.type === this.state.currentAxes.x.type) {
              this.setState(update(this.state, {
                xDefaultValues: {$set: this.state.currentAxes.y.values},
                freqActive: {$set: true},
                currentAxes: {
                  x: {type: {$set: this.state.currentAxes.y.type}, values: {$set: this.state.currentAxes.y.values}, active: {$set: this.state.currentAxes.y.active}},  // Set The X Axis as the Y axis
                  y: {type: {$set: null}, values: {$set: null}, active: {$set: false}}  // Clear The Y Axis
                }
              }), this.updateAxis);
            }
            // Deselected The Y Axis
            else {
              this.setState(update(this.state, {
                freqActive: {$set: true},
                currentAxes: {
                  y: {type: {$set: null}, values: {$set: null}, active: {$set: false}}
                }
              }), this.updateAxis);
            }
          }
          // Deselecting only checkbox
          else if (this.state.currentAxes.x.active === false || this.state.currentAxes.y.active === false) {
            this.setState(update(this.state, {
              currentAxes: {
                x: {active: {$set: false}, type: {$set: null}, values: {$set: null}},   // Set Both X and Y Axis To Null
                y: {active: {$set: false}, type: {$set: null}, values: {$set: null}}
              },
              xDefaultValues: {$set: null}
            }), this.updateAxis);
          }
        }
    }

    updateAxis() {
      if (this.state.currentAxes.x.active === false && this.state.currentAxes.y.active === false) {
        var axesData = this.state.currentAxes;
        this.props.changeAxis(axesData);
        return;
      }
        var axesData = this.state.currentAxes;

        this.state.freqActive ? axesData.x.values = this.state.xDefaultValues.toString().split(",") : //none

        axesData.x.values = axesData.x.values.toString().split(",")

        if (!axesData.y.active) {
            this.state.currentLabel === 'Count' ? axesData.y.values = this.props.getCount(axesData.x.values) : axesData.y.values = this.props.getFreq(axesData.x.values);
            axesData.x.values = this.removeDuplicates(axesData.x.values)
        }
        else {
            axesData.y.values = axesData.y.values.toString().split(",");
        }


        this.props.changeAxis(axesData)
    }

    switchFreq() {
        var temp = this.state.lastLabel;
        this.setState({ lastLabel : this.state.currentLabel })
        this.setState({ currentLabel : temp })
    }

    removeDuplicates(arr) {
        var noDupes = [];
        noDupes.push(arr[0])
        var lastElement = arr[0];

        for (var x = 1; x < arr.length; x++) {
            if (arr[x] !== lastElement) {
                noDupes.push(arr[x]);
                lastElement = arr[x];
            }
        }
        return noDupes;
    }

    render() {
      let x = this.props.axisData;
        const checkboxList = this.props.axisData.map((field) =>
        <div key={field.type}>
            <label>
                {field.type.toUpperCase() + ":  "}
            </label>
            <input
                name={field.type}
                type="checkbox"
                value={field.data}
                key={field.data}
                onChange={this.handleChange}
            />
            {((this.state.currentAxes.x.type === field.type) ) ? <label id={field.type} className={css.label}><b>(X Axis)</b></label> : <label id={field.type}></label>}
            {this.state.currentAxes.y.type === field.type ? <label id={field.type} className={css.label}><b>(Y Axis)</b></label> : <label id={field.type}></label>}
        </div>
        );

        return (
            <div>
                <div className={css.data_options_wrapper}>
                    <div className={css.checkbox_list}>
                        {checkboxList}
                    </div>
                </div>
                <Button
                    label={this.state.currentLabel}
                    onClick={this.switchFreq}
                />
            </div>
        );
    }
}
