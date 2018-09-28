import React from 'react';
import styles from './style.css'

export default class Slider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <div className={styles.rangewrapper}>
                <input className={styles.slider} type="range" min="1" max="100" defaultValue={100} onChange={this.props.updateOpac}/>
            </div>
        );
    }
}