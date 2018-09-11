import React from 'react';
import PropTypes from 'prop-types';
import OrgRecords from './OrgRecords';

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
              (response) => {
                for (var i = 0; i < response[Object.keys(response)[0]].length; i++) {
                  this.setState(previousState => ({
                    records: [...previousState.records, response[Object.keys(response)[0]][i]]
                  }));
                }
              }
            )
          currentCount += 30;
        }
      }
    )
  }
  componentDidMount() {
    this.updateData();
  }
  // Called whenever a new csv is loaded
  componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.info.csv !== prevProps.info.csv) {
    this.updateData();
  }
}

  render() {
    const {error, isLoaded, records, totalRecords} = this.state;
    if (error) {
      return <p> Error: {error.message} </p>;
    }
    if (isLoaded && records.length >= totalRecords) {
      return (
        <OrgRecords info={this.state} />
      )
    }
    else {
      return (<p>Loading...</p>)
    }
  }
}
