import React from 'react';
import css from './Dropdown.css';

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownData: {
                graphType: ['bar', 'line', 'pie'],
                dataType: [], //column names from data goes here
                
            }
        }
    }

    render() {
        const typeOptions = this.state.dropdownData.graphType.map((type) =>
            <option value={type} key={type} onClick={this.props.changeType}>
                {type.toUpperCase()}
            </option>
        )
        return (
            <div>
                <select className={css.select_container}>
                    {typeOptions}
                </select>
            </div>
        )
    }
}