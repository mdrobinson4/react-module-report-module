import React from 'react';
import PropTypes from 'prop-types';
import GraphUI from './GraphUI';

export default class OrgRecords extends React.Component {
  constructor(props) {
    super(props);
    this.records = this.props.records;
  }

  render() {
    let key = Object.keys(this.records[0]);
    let dataArr = {};
    for (let i = 0; i < this.records.length; i++) {
      for (let obj in this.records[i]) {
        dataArr[obj] = [];
        key.push(obj);
      }
    }
    // Store values in arrays
    for (let i = 0; i < this.records.length; i++) {
      for (let obj in this.records[i]) {
        dataArr[obj].push(this.records[i][obj]);
      }
    }
    console.log(dataArr);
      return (
        <div><GraphUI records={dataArr} /></div>
      )
    }
  }
