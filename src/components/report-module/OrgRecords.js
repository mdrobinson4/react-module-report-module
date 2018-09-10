import React from 'react';
import PropTypes from 'prop-types';
import GraphUI from './GraphUI';

// stores the data as an object of arrays
export default class OrgRecords extends React.Component {
  constructor(props) {
    super(props);
    this.records = this.props.info.records;
  }

  render() {
    console.log(this.props.info.csvName);
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
    let records = {name: this.props.info.csvName, data: dataArr}
    console.log(dataArr);
      return (
        <div><GraphUI records={records} /></div>
      )
    }
  }
