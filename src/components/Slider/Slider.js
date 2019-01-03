import React from 'react';
import styles from './Slider.css'

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.range_wrapper}>
        <label className={styles.label}>{this.props.label}</label>
          <input
            className={styles.slider}
            type="range"
            min={this.props.properties.min}
            max={this.props.properties.max}
            defaultValue={this.props.properties.defaultValue}
            onChange={this.props.updateValue}
          />
      </div>
    );
  }
}
