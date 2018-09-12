import React from 'react';
import PropTypes from 'prop-types';
import Select from '@folio/stripes-components/lib/Select';
import GraphUI from './GraphUI';

export default class GetRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csv: this.props.info.csv,
      csvName: this.props.info.csvName,
      error: null,
      isLoaded: false,
      totalRecords: 0,
      records: []
    };
    this.dataArr = {};
  }

  // Gets the records and stores them in this.state.records
  updateData() {
    let currentCount = 0;
    let records = [];
    let csv = this.props.info.csv;

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
        this.setState({
        records: result[Object.keys(result)[0]],
        totalRecords: result.totalRecords,
        isLoaded: true
        });
      }
    )
    .then(
      () => {
        currentCount += 30;
        while (currentCount < this.state.totalRecords) {
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
                  this.setState(previousState => ({
                    records: [...previousState.records, result[Object.keys(result)[0]][i]]
                  }));
                }
              }
            )
          currentCount += 30;
        }
      }
    )
    .then(
      () => {
        let key = Object.keys(this.state.records[0]);
        for (let i = 0; i < this.state.records.length; i++) {
          for (let obj in this.state.records[i]) {
            this.dataArr[obj] = [];
            key.push(obj);
          }
        }
        // Store values in arrays
        for (let i = 0; i < this.records.length; i++) {
          for (let obj in this.records[i]) {
            this.dataArr[obj].push(this.records[i][obj]);
          }
        }
      }
    );
  }

  componentDidMount() {
    this.updateData();
  }

  // Called whenever a new csv is loaded
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
    if (isLoaded && this.dataArr.length >= totalRecords) {
      return (
        <GraphUI records={this.state} />
      )
    }
    else {
      return (<p>Loading...</p>)
    }
  }
}
