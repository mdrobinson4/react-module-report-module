import React from "react";
import Button from './Button';
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
            checked: true,
            fieldMap: new Map()
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateAxis = this.updateAxis.bind(this);
        this.switchFreq = this.switchFreq.bind(this);
        this.removeDuplicates = this.removeDuplicates.bind(this);
        this.removeDuplicatesFromArrayOfArrays = this.removeDuplicatesFromArrayOfArrays.bind(this);
    }

    async handleChange(event) {
        var target = event.target;

        var axis = {
            type: target.name.toString(),
            values: target.value,
            active: target.checked //because we use checkboxes here, we base our logic on if the incoming axis is checked or not
        }

        var stateHolder = this.state.currentAxes;

        //Will eventually refactor this code to be what controls the currentAxes since it is cleaner
        //if (axis.active) {
        //    if (!this.state.currentAxes.x.active) {
        //        stateHolder.x = axis;
        //        this.setState({currentAxes: stateHolder}, this.updateAxis);
        //    }
        //    else {
        //        stateHolder.y = axis;
        //        this.setState({currentAxes: stateHolder}, this.updateAxis);
        //    }
        //}
        //else {
        //    if (this.state.currentAxes.y.active) {
        //        stateHolder.y = axis
        //        this.setState({currentAxes: stateHolder}, this.updateAxis);
        //    }
        //    else {
        //        stateHolder.x = axis
        //        this.setState({currentAxes: stateHolder}, this.updateAxis);
        //    }
        //}

        //if the current values match the default, the user is deselecting the X axis in which case the Y axis becomes the new X axis
        if (this.state.xDefaultValues == axis.values && !this.state.freqActive) {
            //we create a new object here because if copy the state directly the plotly component won't update, you can read more about this in their documentation
            let yAxisClone = stateHolder.y;

            stateHolder.x = {
                type: yAxisClone.type,
                values: yAxisClone.values,
                active: yAxisClone.active
            }

            stateHolder.y = {
                type: "",
                values: [],
                active: false
            }

            this.setState({xDefaultValues : stateHolder.x.values})
            this.setState({freqActive: true});
            this.setState({currentAxes : stateHolder}, this.updateAxis)
        }
        else if (!this.state.currentAxes.x.active) { //if no axis is currently selected

            stateHolder.x = axis;

            this.setState({freqActive : true})
            this.setState({xDefaultValues : axis.values.toString().split(",")})

            this.setState({currentAxes: stateHolder}, this.updateAxis);
        }
        else if (!axis.active && !this.state.currentAxes.y.active) { 

            axis.type = "";
            stateHolder.x = axis;

            this.setState({currentAxes: stateHolder}, this.updateAxis);
            this.setState({freqActive : true})

        }
        else if (!axis.active && this.state.currentAxes.y.active) {

            axis.type = "";
            stateHolder.y = axis;

            this.setState({currentAxes: stateHolder}, this.updateAxis);
            this.setState({freqActive : true})

        }
        else if (axis.active && !this.state.currentAxes.y.active) {

            stateHolder.y = axis
            this.setState({currentAxes: stateHolder}, this.updateAxis)
            this.setState({freqActive : false})
        }

    }
    //Simply updates the current axes stored in DataOptions and send them to App.js and the Plot component
    updateAxis() {
        var axesData = this.state.currentAxes;

        if (this.state.freqActive) axesData.x.values = this.state.xDefaultValues;
        //the values are stored as strings on the HTML input element and need to be split
        axesData.x.values = axesData.x.values.toString().split(",")

        if (!axesData.y.active) {
            this.state.currentLabel === 'Count' ? axesData.y.values = this.props.getCount(axesData.x.values) : axesData.y.values = this.props.getFreq(axesData.x.values);

            axesData.x.active ? axesData.y.type = this.state.currentLabel  : axesData.y.type = "";

            axesData.x.values = this.removeDuplicates(axesData.x.values)

        }
        else {
            axesData.y.values = axesData.y.values.toString().split(",");
        }

        this.props.changeAxis(axesData);
    }
    //switches the current count/frequency label to the opposite option
    switchFreq() {
        var temp = this.state.lastLabel;
        this.setState({ lastLabel : this.state.currentLabel })
        this.setState({ currentLabel : temp })
    }
    //this function works with the languages dataset option and can probably be integrated with the other removeDupes function
    removeDuplicatesFromArrayOfArrays(arr) {
        let valueMap = new Map();
        let indexArray = [];
        let individualArray = []; 

        for (let j = 0; j < arr.length; j++) {
            if (arr[j].length > 0) {

                individualArray = arr[j]

                for (let i = 0; i < individualArray.length; i++) {

                    if (valueMap.has(individualArray[i])) {
                        let keyValue = valueMap.get(individualArray[i]);
                        keyValue++;
                        
                        valueMap.set(individualArray[i], keyValue);
                    }
                    else {
                        valueMap.set(individualArray, 1);
                        indexArray.push(individualArray);
                    }
                }
            }
        }

        return indexArray;
    }
    //removes all duplicate values and replace empty values with 'no value' so that it can be properly labeled on the graph
    removeDuplicates(arr) {
        let noDupes = [];

        for (let i = 0; i < arr.length; i++) {

            if (arr[i] == "") arr[i] = "No Value";

            if (!noDupes.includes(arr[i])) noDupes.push(arr[i]);
        }

        return noDupes;
    }

    render() { 
        var checkboxList = this.props.axisData.map((field) =>
        <div key={field.type}>
            <label>
                {field.type.toUpperCase() + ":  "}
            </label>
            <input
                name={field.type}
                type="checkbox"
                value={field.data}
                key={field.type}
                onChange={this.handleChange}
            />
            {this.state.currentAxes.x.type === field.type ? <label id={field.type} className={css.label}><b>(X Axis)</b></label> : <label id={field.type}></label>}
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
