import React from "react";
import Button from './Button';


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
            currentLabel: 'count',
            lastLabel: 'frequency'
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
            this.state.currentLabel === 'count' ? axesData.y.values = this.props.getCount(axesData.x.values) : axesData.y.values = this.props.getFreq(axesData.x.values);
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
        <li>
            <label>
                {field.type.toUpperCase() + ":  "}  
                <input 
                    name={field.type}
                    type="checkbox"
                    value={field.data}
                    onChange={this.handleChange}
                />
            </label>
        </li>
        );

        return (
            <div>
                <ul>
                    {checkboxList}
                </ul>
                <Button
                    label={this.state.currentLabel}
                    onClick={this.switchFreq}
                />
            </div>
        );
    }
}