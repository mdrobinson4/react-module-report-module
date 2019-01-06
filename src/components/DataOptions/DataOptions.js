import React from "react";
import css from './DataOptions.css';
import update from 'immutability-helper';
import { Button } from '@folio/stripes-components';


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
            checked: true,
            hasLoaded: false
        }
        this.checkboxData = [];
    }

    componentDidUpdate(prevProps, prevState) {
      if ((this.props.checkboxData !== undefined) && this.props.checkboxData != prevProps.checkboxData) {
        let data = {values: this.props.checkboxData[0].data};
        document.querySelector('input[name=' + this.props.checkboxData[0].type + ']').checked = true;
        this.setState(update(this.state, {
          currentAxes: {
            x: {active: {$set: true}, type: {$set: this.props.checkboxData[0].type}, values: {$set: this.props.checkboxData[0].data}},   // Set Both X and Y Axis To Null
            y: {active: {$set: false}, type: {$set: null}, values: {$set: null}}
          },
          xDefaultValues: {$set: this.props.checkboxData[0].data},
          freqActive: {$set: true}
        }), this.updateAxis);
      }

    }

    handleChange = (event) => {
        let target = event.target;
        let axis = {
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
            if (this.props.graphType === 'pie') {  // Prevent 2nd checkbox from being checked if 2d pie chart
              event.target.checked = false;
              return;
            }
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
                x: {active: {$set: false}, type: {$set: []}, values: {$set: null}},   // Set Both X and Y Axis To Null
                y: {active: {$set: false}, type: {$set: []}, values: {$set: null}}
              },
              xDefaultValues: {$set: null}
            }), this.updateAxis);
          }
        }
    }

    // Gets the values as strings and returns as an array
    getValues = (data) => {
      if (data.active === true) // Converts string to array if active
        return data.values.toString().split(",");
      else if (data.active === false)  // Returns empty array if not active
        return [];
    }

    updateAxis = () => {
      let data = this.state.currentAxes;
      let xValues = this.getValues(data.x);
      let yValues = this.getValues(data.y);

      // Only the XAXIS is selected
      if (data.x.active === true && data.y.active === false) {
        if (this.state.currentLabel === 'Count')                  // Count is selected
          data.y.values = this.props.getCount(xValues);
        else if (this.state.currentLabel === 'Frequency')         // Frequency was selected
          data.y.values = this.props.getFreq(xValues);
        data.y.type = this.state.currentLabel;                    // Set the label [Count / Frequency]
        data.x.values = this.removeDuplicates(xValues);           // Remove the duplicates from the XVALUES
      }
      // Either both or neither of the axis are selected
      else {
        data.x[0].values = this.removeDuplicates(xValues);
        data.y[0].values = this.getCount(xValues);
        data.x[1].values = this.removeDuplicates(yValues);
        data.y[1].values = this.getCount(yValues);
      }
      this.props.updateGraph(data, xValues);
    }

    toggleDataType = () => {
      let temp = this.state.lastLabel;
      this.setState({
        lastLabel: this.state.currentLabel,
        currentLabel: temp
      }, this.updateAxis);
    }

    removeDuplicates = (arr) => {
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
    cleanCheckboxLabel = (text) => {
      let newStr = '';
      let index = 0;
      for (let char of text) {
        index = text.indexOf(char);
        if (index > 0 && char === char.toUpperCase()) {
          return newStr = text.substring(0, 1).toUpperCase() + text.substring(1, index) + ' ' + text.substring(index);
        }
      }
      return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    switchAxis = () => {
      if (this.state.currentAxes.x.active === true && this.state.currentAxes.y.active == false) // Prevents user from only having YAXIS
        return;
      this.setState({
        // Swaps X and Y axis
        currentAxes: {
          y: this.state.currentAxes.x,
          x: this.state.currentAxes.y,
        },
        xDefaultValues: this.state.currentAxes.y.values
      }, this.updateAxis);
    }

    render() {
      let x = this.props.checkboxData;
      let checkboxText = [];
      if (this.props.graphType === 'histogram')
        checkboxText = ['X1', 'X2'];
      else
        checkboxText = ['X Axis', 'Y Axis'];

        const checkboxList = this.props.checkboxData.map((field) =>
        <div key={field.type}>
            <label>
                {this.cleanCheckboxLabel(field.type) + ":  "}
            </label>
            <input
                name={field.type}
                type="checkbox"
                value={field.data}
                key={field.data}
                onChange={this.handleChange}
            />
            {((this.state.currentAxes.x.type === field.type) ) ? <label id={field.type} className={css.label}><b>{checkboxText[0]}</b></label> : <label id={field.type}></label>}
            {this.state.currentAxes.y.type === field.type ? <label id={field.type} className={css.label}><b>{checkboxText[1]}</b></label> : <label id={field.type}></label>}
        </div>
        );
        return (
            <div>
                <div className={css.data_options_wrapper}>
                    <div className={css.checkbox_list}>
                      {checkboxList}
                    </div>
                </div>
                <Button onClick={this.toggleDataType}>
                  {this.state.currentLabel}
                </Button>
                <Button onClick={this.switchAxis}>
                  Switch Axis
                </Button>
            </div>
        );
    }
}
