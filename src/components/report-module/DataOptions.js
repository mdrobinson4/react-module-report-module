import React from "react";


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
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateAxis = this.updateAxis.bind(this);
        this.getCount = this.getCount.bind(this);
    }

    componentDidMount() {

    }

    handleChange(event) {
        //this.setState({currentYAxis: axis}, this.updateAxis)
        //this.setState({...this.state.currentAxes, x: axis}, this.updateAxis)
        //this.setState({...this.state.currentAxes, y: axis}, this.updateAxis)
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
            axesData.y.values = this.getCount(axesData.x.values);
            console.log(axesData.y.values);
        }
        else {
            axesData.y.values = axesData.y.values.toString().split(",");
        }
        

        this.props.changeAxis(axesData)
    }

    getCount(arr) {

        var lastElement;
        var count = 1;

        var frequencyArr = [];

        for (var x = 0; x < arr.length; x++) {
            if (arr[x] === lastElement) {
                count++;
            }
            else {
                frequencyArr.push(count);
                count = 1;
                lastElement = arr[x];
            }
        }

        return frequencyArr;
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
            <ul>
                {checkboxList}
            </ul>
        );
    }
}