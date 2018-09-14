import React from 'react';
import PropTypes from 'prop-types';
import Select from '@folio/stripes-components/lib/Select';
import GraphUI from './GraphUI';


let dataArr = {};
let records = [];
let totalRecords = 0;
let currentCount = 0;

export default class GetRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csv: this.props.info.dataset.url,
      csvName: this.props.info.dataset.name,
      error: null,
      isLoaded: false,
      totalRecords: 0,
      records: []
    };

  }

  // Gets the records and stores them in this.state.records
  updateData() {
    let csv = this.props.info.dataset.url;
    fetch(csv.slice(0, csv.indexOf('offset=') + 7) + currentCount + csv.slice(csv.indexOf('offset=') + 7), {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        'X-Okapi-Tenant': 'diku',
        'X-Okapi-Token': this.props.info.okapiToken
      })
    })
    .then(res => res.json())
    .then(
      (result) => {
      // Access the items stored in the first key, which contains the data we want
      records = result[Object.keys(result)[0]];
      totalRecords = result.totalRecords;
      this.getRecords(csv);
      this.mergeRecords(records);
    });
  }

  getRecords = (csv) => {
    currentCount += 30;
    while (currentCount < totalRecords) {
      console.log(`currentCount: ${currentCount} < totalRecords: ${totalRecords}`);
      fetch(csv.slice(0, csv.indexOf('offset=') + 7) + currentCount + csv.slice(csv.indexOf('offset=') + 7), {
          method: 'GET',
          headers: new Headers({
            'Content-type': 'application/json',
            'X-Okapi-Tenant': 'diku',
            'X-Okapi-Token': this.props.info.okapiToken
          })
        })
        .then(res => res.json())
        .then(
          (result) => {
            for (let i = 0; i < result[Object.keys(result)[0]].length; i++) {
              records.push(result[Object.keys(result)[0]][i]);
              console.log(records);
            }
            currentCount += 30;
          }
        )
    }
    console.log(dataArr);
  }

  mergeRecords = (records) => {
    let key = Object.keys(records[0]);

  for (let i in records) {
    for (let obj in records[i]) {
      dataArr[obj] = [];
      key.push(obj);
    }
  }

    // Store values in arrays
  for (let i in records) {
    for (let obj in records[i]) {
      dataArr[obj].push(records[i][obj]);
    }
  }

  this.props.info.getRecords(dataArr);
  this.handleMerge();

  }

  handleMerge = () => {
    this.setState({
      isLoaded: true
    });
    console.log('RECORDS MERGED');
    console.log(`isLoaded is now {${this.state.isLoaded}}`);
    console.log(dataArr);
  }

  componentDidMount() {
    this.updateData();
    this.props.info.getRecords(dataArr);
  }

  // Called whenever a new dataset is loaded
  componentDidUpdate(prevProps) {
  if (this.props.info.csv !== prevProps.info.csv) {
    this.updateData();
  }
}

  render() {
    const {error, isLoaded, totalRecords} = this.state;
    if (error) {
      return <p> Error: {error.message} </p>;
    }
    if (isLoaded === true) {
      return (<div>DONE</div>
      )
    }
    else {
      return (<p>Loading...</p>)
    }
  }
}
