import React from "react";
import styles from './style.css';

export default class DataOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isChecked: {
                value: { },
                status: false
            },
            prop: [
                'Dog',
                'Cat'
            ]
        }



        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {

    }

    handleChange(event) {
        const target = event.target;
        const value = target.type;
    }


    render() {

        const properties = this.props.properties;
        const checkboxList = properties.map((property) =>
        <li>
            <label>
                {property} 
                <input name={property} type="checkbox" onChange={this.handleChange}/>
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