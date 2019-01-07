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
        let index = 0;
        let data = {values: this.props.checkboxData[0].data};   // Collect the data from the first checkbox
        document.querySelector('input[name=' + this.props.checkboxData[0].type + ']').checked = true; // Check the first checkbox
        this.setState(update(this.state, {
          x: {  // Default XAXIS data
            [index]: {active: {$set: true},
            type: {$set: this.props.checkboxData[0].type},
            values: {$set: this.props.checkboxData[0].data}
            }
          },
          y: {$set: this.state.notActive} // set YAXIS data to null
        }), this.updateAxis);
      }
    }

    handleChange = (e) => {
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
            if (this.props.graphType === 'pie') {  // Prevent 2nd checkbox from being checked if 2d pie chart
              event.target.checked = false;
              return;
            }
            this.setState(update(this.state, {
              x: {[index + 1]: {$set: axis}}
            }), this.updateAxis);
          }
          // Setting First checkbox
          else {
            this.setState(update(this.state, {
              x: {[index]: {$set: axis}}
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

    setYaxis = (indices) => {
      let data = {x: this.state.x, y: [{values: []}, {values: []}]};
      for (let index of indices) {

        if (this.state.currentLabel === 'Count')
          data.y[index].values = this.props.getCount(data.x[index].values);
        else
          data.y[index].values = this.props.getFreq(data.x[index].values);
        data.x[index].values = this.removeDuplicates(data.x[index].values);
      }
      let index = 0;
      this.setState(update(this.state, {
        y: {
          [index]: {values: {$set: data.y[0].values}},
          [index + 1]: {values: {$set: data.y[1].values}}
        },
        x: {$set: data.x}
      }), this.props.updateGraph({x: data.x, y: data.y}));
    }

    updateAxis = () => {
      let labels = [];
      if (this.state.x[0].active === true && this.state.x[1].active === true)
        labels = [0, 1];
      else
        labels = [0];

      let data = this.setYaxis(labels);
    }

    toggleDataType = (e) => {
      let temp = this.state.lastLabel;
      this.setState({
        lastLabel: this.state.currentLabel,
        currentLabel: temp
      }, this.updateAxis);
    }

    removeDuplicates = (arr) => {
      let flag = false;
      let unique = [];
      for (let item of arr) {
        for (let find of unique) {
          if (find === item)
            flag = true;
        }
         if (flag === false)
           unique.push(item);
         flag = false;
      }
      return unique;
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
      let index = 0;
      this.setState(update(this.state, {
        x: {[index]: {values: {$set: this.state.y[0].values}}, [index + 1]: {values: {$set: this.state.y[1].values}}},
        y: {[index]: {values: {$set: this.state.x[0].values}}, [index + 1]: {values: {$set: this.state.x[1].values}}},
      }), () => {this.props.updateGraph({x: this.state.x, y: this.state.y})});
    }

    render() {
      let x = this.props.checkboxData;
      let checkboxText = ['X0', 'X1'];

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
            {((this.state.x[0].type === field.type) ) ? <label id={field.type} className={css.label}><b>{checkboxText[0]}</b></label> : <label id={field.type}></label>}
            {this.state.x[1].type === field.type ? <label id={field.type} className={css.label}><b>{checkboxText[1]}</b></label> : <label id={field.type}></label>}
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
