import React from 'react';
import styles from './Slider.css';
import update from 'immutability-helper';

export default class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value: 0
        }
        this.windowChange = true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.windowChange === true) {
        if (prevProps.width !== this.props.width) {
          if (!(isNaN(this.props.width)) === true) {
            this.setState(update(this.state, {value: {$set: this.props.width}})); // Update the slider with the value from the window changing
          }
        }
      }
    }

    handleChange = e => {
      console.log(`Updating Slider Value To: ${e.target.value}`);
      this.setState(update(this.state, {value: {$set: e.target.value}}));
      this.windowChange = false;
      console.log(this.windowChange);
      this.props.updateSize(e);
      console.log(this.windowChange);
      this.windowChange = true;
    }

    render() {
      console.log(this.state.value);
      return (
        <div className={styles.range_wrapper}>
          <label className={styles.label}>{this.props.label}</label>
            <input
              className={styles.slider}
              type="range"
              min={120}
              max={2500}
              value={this.state.value}
              onChange={this.handleChange}
            />
        </div>
        );
    }
}
