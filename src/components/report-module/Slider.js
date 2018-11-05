import React from 'react';
import styles from './Slider.css';
import update from 'immutability-helper';

export default class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value: 0
        }
        this.currWidth = window.innerWidth;
        this.currHeight = window.innerHeight;
    }

    // Size changed by window resize 
    componentDidUpdate(prevProps, prevState) {
      console.log(`Width: ${this.currWidth}, Height: ${this.currHeight}`);
      if (this.currWidth !== window.innerWidth || this.currHeight !== window.innerHeight) {
        if (!(isNaN(this.props.width)) === true) {
          this.setState(update(this.state, {value: {$set: Number(this.props.width)}})); // Update the slider with the value from the window changing
        }
        this.currWidth = window.innerWidth;
        this.currHeight = window.innerHeight;
      }
    }

    handleChange = e => {
      console.log(`Updating Slider Value To: ${e.target.value}`);
      this.setState(update(this.state, {value: {$set: e.target.value}}));
      this.props.updateSize(e);
    }

    render() {
      console.log(Number(this.state.value));
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
