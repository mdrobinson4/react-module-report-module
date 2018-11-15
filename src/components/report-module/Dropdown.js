import React from 'react';
import css from './Dropdown.css';

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            graphType: ['Bar', 'Line', 'Pie', 'Histogram'],
            dataType: [], //column names from data goes here
        }
        this.changeType = this.changeType.bind(this)
    }

    changeType(e) {
        let newType = e.target.value;

        this.props.changeType(newType);
    }

    render() {
        const typeOptions = this.state.graphType.map((type) =>
            <option value={type} key={type}>
                {type}
            </option>
        )
        return (
            <div>
                <label className={css.label}>{this.props.label}</label>
                <select className={css.select_container} onChange={this.changeType}>
                    {typeOptions}
                </select>
            </div>
        )
    }
}