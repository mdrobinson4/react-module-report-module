import React from 'react';
import PropTypes from 'prop-types';
import OrgRecords from './OrgRecords';

export default class GetRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      totalRecords: 0,
      records: []
    };
  }
  componentDidMount() {
    let currentCount = 0;
    let records = [];

    fetch('http://localhost:9130/instance-storage/instances?limit=30&offset=' + currentCount + '&query=%28title%3D%22%2A%22%20or%20contributors%20adj%20%22%5C%22name%5C%22%3A%20%5C%22%2A%5C%22%22%20or%20identifiers%20adj%20%22%5C%22value%5C%22%3A%20%5C%22%2A%5C%22%22%29%20sortby%20title', {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        'X-Okapi-Tenant': 'diku',
        'X-Okapi-Token': this.props.okapiToken
      })
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
        records: result.instances,
        totalRecords: result.totalRecords,
        isLoaded: true
        });
      }
    )
    .then(
      () => {
        currentCount += 30;
        while (currentCount < this.state.totalRecords) {
          fetch('http://localhost:9130/instance-storage/instances?limit=30&offset=' + currentCount + '&query=%28title%3D%22%2A%22%20or%20contributors%20adj%20%22%5C%22name%5C%22%3A%20%5C%22%2A%5C%22%22%20or%20identifiers%20adj%20%22%5C%22value%5C%22%3A%20%5C%22%2A%5C%22%22%29%20sortby%20title', {
              method: 'GET',
              headers: new Headers({
                'Content-type': 'application/json',
                'X-Okapi-Tenant': 'diku',
                'X-Okapi-Token': this.props.okapiToken
              })
            })
            .then(res => res.json())
            .then(
              (response) => {
                for (var i = 0; i < response.instances.length; i++) {
                  this.setState(previousState => ({
                    records: [...previousState.records, response.instances[i]]
                  }));
                }
              }
            )
          currentCount += 30;
        }
      }
    )
  }
  render() {
    const {error, isLoaded, records, totalRecords} = this.state;
    if (error) {
      return <div> Error: {error.message} </div>;
    }
    if (isLoaded && records.length >= totalRecords) {
      return (
        <div><OrgRecords records={records} /></div>
      )
    }
    else {
      return (
        <div>Loading...</div>
      )
    }
  }
}
