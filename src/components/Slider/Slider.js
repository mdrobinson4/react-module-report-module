import React from 'react';
import styles from './Slider.css';
import update from 'immutability-helper';

export default class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 10}
    }

    handleChange = e => {
      this.props.onChange(e);
    }

    render() {
      let value = this.props.value || this.props.default;
      return (
        <div className={styles.range_wrapper}>
          <label className={styles.label}>{this.props.label}</label>
            <input
              className={styles.slider}
              type="range"
              min={this.props.min}
              max={this.props.max}
              value={value}
              onChange={this.handleChange}
            />
        </div>
        );
    }
}
