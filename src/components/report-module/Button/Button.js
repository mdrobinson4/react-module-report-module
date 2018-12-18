import React from "react";
import css from './Button.css'

export default class Button extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <button
                onClick={this.props.onClick}
                className={css.button}
                value={this.props.value}
            >
                {this.props.label}
            </button>
        )
    }
}