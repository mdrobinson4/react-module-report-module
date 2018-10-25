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
            xDefaultValues: []
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

        this.state.freqActive ? axesData.x.values = this.state.xDefaultValues : //none

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
