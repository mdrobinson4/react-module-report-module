import React from 'react';

export default class Slider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <div>
                <input type="range" min="1" max="100" defaultValue={100} onChange={this.props.updateOpac}/>
            </div>
        );
    }
}