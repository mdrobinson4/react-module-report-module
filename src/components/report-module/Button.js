import React from "react";

export default class Button extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <button
                onClick={this.props.onClick}
                className={this.props.style}
            >
                {this.props.label}
            </button>
        )
    }
}