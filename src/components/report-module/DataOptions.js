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
            checked: true
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateAxis = this.updateAxis.bind(this);
        this.switchFreq = this.switchFreq.bind(this);
        this.removeDuplicates = this.removeDuplicates.bind(this);
        this.removeDuplicatesFromArrayOfArrays = this.removeDuplicatesFromArrayOfArrays.bind(this);
    }

    async handleChange(event) {
        var target = event.target;
        console.log(target);
        var axis = {
            type: target.name.toString(),
            values: target.value,
            active: target.checked
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

        if (this.state.xDefaultValues == axis.values && !this.state.freqActive) {
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
        else if (!this.state.currentAxes.x.active) {

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

    updateAxis() {
        var axesData = this.state.currentAxes;

        this.state.freqActive ? axesData.x.values = this.state.xDefaultValues : 

        axesData.x.values = axesData.x.values.toString().split(",")

        if (!axesData.y.active) {
            this.state.currentLabel === 'Count' ? axesData.y.values = this.props.getCount(axesData.x.values) : axesData.y.values = this.props.getFreq(axesData.x.values);

            axesData.x.values = this.removeDuplicates(axesData.x.values)

            if (axesData.x.values.length < axesData.y.values.length) {
                this.state.currentLabel === 'Count' ? axesData.y.values = this.props.getCount(axesData.x.values) : axesData.y.values = this.props.getFreq(axesData.x.values);
            }
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

    removeDuplicates(arr) {
        let noDupes = [];
        let count = 0;
        let uniqueValues = new Map();

        while (arr[count] == "") {
            count ++;
        }

        noDupes.push(arr[count])

        uniqueValues.set(noDupes[0])

        for (var x = 0; x < arr.length; x++) {
            if (!uniqueValues.has(arr[x]) && arr[x] !== "") {
                noDupes.push(arr[x]);
                uniqueValues.set(arr[x]);
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
