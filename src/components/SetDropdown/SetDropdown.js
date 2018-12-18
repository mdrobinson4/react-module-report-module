import React from 'react';
import css from './SetDropdown.css';

export default class SetDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSetChange = (e) => {
      this.props.changeSet(e);
    }

    render() {
        const setOptions = this.props.values.map((set) =>
            <option value={set} key={set}> {set} </option>
        )
        return (
            <div>
                <label className={css.label}>{this.props.label}</label>
                <select className={css.select_container} onChange={this.handleSetChange}>
                    {setOptions}
                </select>
            </div>
        )
    }
}
