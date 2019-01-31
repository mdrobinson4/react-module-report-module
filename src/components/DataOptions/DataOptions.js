import React from "react";
import css from './DataOptions.css';
import update from 'immutability-helper';
import { Button } from '@folio/stripes-components';


export default class DataOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          x: [
            {type: '', values: [ ], active: false},
            {type: '', values: [ ], active: false}
          ],
          y: [
            {values: [ ]},
            {values: [ ]}
          ],
          labels: ['Count', 'Frequency'],
          currentLabel: 'Count',
          lastLabel: 'Frequency',
          freqActive: false,
          xDefaultValues: [],
          checked: true,
          hasLoaded: false,
          notActive: [
            {type: '', values: [ ], active: false},
            {type: '', values: [ ], active: false}
          ]
        }
        this.checkboxData = [];
    }

    componentDidUpdate(prevProps, prevState) {
      if ((this.props.checkboxData !== undefined) && this.props.checkboxData != prevProps.checkboxData) {
        let data = {values: this.props.checkboxData[0].data};   // Collect the data from the first checkbox
        document.querySelector('input[name=' + this.props.checkboxData[0].type + ']').checked = true; // Check the first checkbox
        this.setState(update(this.state, {
          x: {  // Default XAXIS data
            [0]: {active: {$set: true},
            type: {$set: this.props.checkboxData[0].type},
            values: {$set: this.props.checkboxData[0].data}
            },
            [1]: {$set: this.state.notActive[0]}
          },
          y: {$set: this.state.notActive} // set YAXIS data to null
        }), this.updateAxis);
      }
      else if (this.props.graphType !== prevProps.graphType)
        this.updateAxis();
    }

    /* This function is called when a checkbox is checked or unchecked. */
    handleChange = (e) => {
      // Object to store the name of the checkbox selected, get the values from
      // the checkbox, and specify whether the checkbox was checked or uncheked
        let axis = {
            type: e.target.name,
            values: this.getValues(e.target),
            active: e.target.checked
        }
        let index = 0;

        if (axis.active === true) {
          // Attempting to check third checkbox
          if (this.state.x[0].active === true && this.state.x[1].active === true) {
            // alert('DESELCT ONE FIRST!!');
            e.target.checked = false;
          }
          // Selected second checkbox
          else if (this.state.x[0].active === true) {
            this.setState(update(this.state, {
              x: {[1]: {$set: axis}}
            }), this.updateAxis);
          }
          // Setting First checkbox
          else {
            this.setState(update(this.state, {
              x: {[0]: {$set: axis}}
            }), this.updateAxis);
          }
        }
        // Deselected a checkbox
        else if (axis.active === false) {
          // Both X and Y Axis Are Set
          if (this.state.x[0].active === true && this.state.x[1].active === true) {
            // Deselecting first checkbox
            if (axis.type === this.state.x[0].type) {
              this.setState(update(this.state, {
                x: {[index]: {$set: this.state.x[1]}, [index + 1] : {$set: this.state.notActive[0]}}
              }), this.updateAxis);
            }
            // Deselecting the second checkbox
            else {
              this.setState(update(this.state, {
                x: {[index + 1]: {$set: this.state.notActive[0]}}
              }), this.updateAxis);
            }
          }
          // Deselecting only checkbox
          else if (this.state.x[0].active === false || this.state.x[1].active === false) {
            this.setState(update(this.state, {
              x: {$set: this.state.notActive},
              y: {$set: this.state.notActive},
            }), this.updateAxis);
          }
        }
    }

    // Gets the values as strings and returns as an array
    getValues = (target) => {
      if (target.checked === true) // Converts string to array if active
        return target.value.toString().split(",");
      else  // Returns empty array if not active
        return [];
    }

    /* This function sets the yaxis values */
    setYaxis = (indices) => {
      console.log(this.props.graphType);
      let data = {x: this.state.x, y: [{values: []}, {values: []}]};  // default data object for plotly
      for (let index of indices) {

        if (this.state.currentLabel === 'Count') {  // set yaxis as the count of the xvalues
          let count = this.props.getCount(data.x[index].values);
          if (this.props.graphType === 'pie') {
            data.y[index].values = count.all; // set yaxis as the the total count of the xvalues (not only unique values)
          }
          else {
            data.y[index].values = count.unique;  // store the unique count values in y
            data.x[index].values = this.removeDuplicates(data.x[index].values); // remove the duplicate values from x
          }
        }
        else
          data.y[index].values = this.props.getFreq(data.x[index].values);  // instead of getting count of xvalues, get the frequency

      }
      let index = 0;
      this.setState(update(this.state, {
        y: {
          [index]: {values: {$set: data.y[0].values}},  // store the yvalues from the temporary object into y[0].values state variable
          [index + 1]: {values: {$set: data.y[1].values}}   // store the yvalues from the temporary object into y[1].values state variable
        },
        x: {$set: data.x} // set the xvalues
      }), this.props.updateGraph({x: data.x, y: data.y}));  // function to call once state has been updated
    }

    /*  This function tells the setYaxis function how many sets of data are stored. Honestly, pretty useless. It should be inside setYaxis */
    updateAxis = () => {
      let labels = [];
      if (this.state.x[0].active === true && this.state.x[1].active === true)
        labels = [0, 1];  // if there are two xvalue sets
      else
        labels = [0]; // if there is only one xvalue set

      let data = this.setYaxis(labels);
    }

    /* Used to toggle between 'Count' and 'Frequency' */
    toggleDataType = (e) => {
      let temp = this.state.lastLabel;  // The last set label
      // set the new label
      this.setState({
        lastLabel: this.state.currentLabel, // set lastLabel state variable
        currentLabel: temp  // Update current label state variable
      }, this.updateAxis);  // call updateAxis once state variable is set
    }

    // return array with the unique values
    removeDuplicates = (arr) => {
      let flag = false;
      let unique = [];
      for (let item of arr) { // iterate the array
        for (let find of unique) {  // see if "item" is already stored in the "unique" array
          if (find === item)  // item is stored in "unique" array
            flag = true;  // set flag to indicate duplicate item
        }
         if (flag === false)  // item was not already in "unique" array
           unique.push(item); // add the new item to the "unique" array
         flag = false;  // reset flag to false
      }
      return unique;  // return the array of unique values
    }
    cleanCheckboxLabel = (text) => {
      let newStr = '';
      let index = 0;
      for (let char of text) {  // iterate through text
        index = text.indexOf(char);
        if (index > 0 && char === char.toUpperCase()) {
          return newStr = text.substring(0, 1).toUpperCase() + text.substring(1, index) + ' ' + text.substring(index);  // Clean up label
        }
      }
      return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    /* Used to swap the x and y axis */
    switchAxis = () => {
      let index = 0;
      this.setState(update(this.state, {
        x: {[index]: {values: {$set: this.state.y[0].values}}, [index + 1]: {values: {$set: this.state.y[1].values}}},  // store the x data in the y state variable
        y: {[index]: {values: {$set: this.state.x[0].values}}, [index + 1]: {values: {$set: this.state.x[1].values}}},  // store the y data in the x state variable
      }), () => {this.props.updateGraph({x: this.state.x, y: this.state.y})});  // call updateGraph with the new x and y state variables as parameters after the state is set
    }

    render() {
      let x = this.props.checkboxData;
      let checkboxText = ['X0', 'X1'];  // text to display outside checkboxes
        // Create a checkbox for each field in the dataset
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
            {((this.state.x[0].type === field.type) ) ? <label id={field.type} className={css.label}><b>{checkboxText[0]}</b></label> : <label id={field.type}></label>}  // if checkbox is checked display X0 beside it
            {this.state.x[1].type === field.type ? <label id={field.type} className={css.label}><b>{checkboxText[1]}</b></label> : <label id={field.type}></label>}       // if second checkbox is checked display X1 beside it
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
