import React from "react";


export default class DataOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isChecked: {
                axisValues: [],
                status: false
            },
            currentAxis: {
                type: String,
                values: []
             }
        }

        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {

    }

    handleChange(event) {
        const target = event.target;

        const axis = {
            type: target.name,
            values: target.value
        }

        this.setState({currentAxis: axis}, this.updateAxis)

    }

    updateAxis() {
        var convertedValues = this.state.currentAxis.values.split(",")
        this.props.changeAxis(convertedValues)
    }


    render() {

        const checkboxList = this.props.axisData.map((field) =>
        <li>
            <label>
                {field.type.toUpperCase() + ":  "}  
                <input name={field.type} type="checkbox" value={field.data} onChange={this.handleChange}/>
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