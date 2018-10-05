import React from "react";
import Button from './Button';
import css from './style.css';


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
            lastLabel: 'Frequency'
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateAxis = this.updateAxis.bind(this);
        this.switchFreq = this.switchFreq.bind(this);
        this.removeDuplicates = this.removeDuplicates.bind(this);
    }

    handleChange(event) {

        var target = event.target;

        var axis = {
            type: target.name,
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
        
        if (!this.state.currentAxes.x.active) {

            stateHolder.x = axis;
            this.setState({currentAxes: stateHolder}, this.updateAxis);

        }
        else if (!axis.active && !this.state.currentAxes.y.active) {

            stateHolder.x = axis;
            this.setState({currentAxes: stateHolder}, this.updateAxis);
        }
        else if (!axis.active && this.state.currentAxes.y.active) {

            stateHolder.y = axis;
            this.setState({currentAxes: stateHolder}, this.updateAxis);

        }
        else if (axis.active && !this.state.currentAxes.y.active) {

            stateHolder.y = axis
            this.setState({currentAxes: stateHolder}, this.updateAxis)

        }

    }

    updateAxis() {
        var axesData = this.state.currentAxes;

        axesData.x.values = axesData.x.values.toString().split(",");
        
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

        const checkboxList = this.props.axisData.map((field) =>
        <div>
            <label>
                {field.type.toUpperCase() + ":  "}  
                <input 
                    name={field.type}
                    type="checkbox"
                    value={field.data}
                    onChange={this.handleChange}
                />
            </label>
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
                    style={css.button}
                />
            </div>
        );
    }
}