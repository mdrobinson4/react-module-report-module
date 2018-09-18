import React from 'react';


let dataArr = {};
let records = [];

export default class GetRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isloaded: false,
      error: ''
    };
    this.getRecords = this.getRecords.bind(this);
  }

  // Gets the records and stores them in this.state.records
  getRecords() {
    fetch(this.props.url, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        'X-Okapi-Tenant': 'diku',
        'X-Okapi-Token': this.props.token
      })
    })
    .then(result => result.json())
    .then(
      (result) => {
        // Access the items stored in the first key, which contains the data we want
        this.props.records = result[Object.keys(result)[0]];
    })
    .then(
      () => {
        this.mergeRecords(records);
      }
    )
    .catch(
      (error) => {
        this.setState({
          error: error
        });
      }
    )
  }

  mergeRecords = (records) => {
    // Access each key in the instance object
    let key = Object.keys(records[0]);
    for (let i in records)
      for (let obj in records[i]) {
        dataArr[obj] = [];
        key.push(obj);
      }
    // Store values in arrays
    for (let i in records)
      for (let obj in records[i])
        dataArr[obj].push(records[i][obj]);
    this.handleMerge();
  }

  handleMerge = () => {
    this.setState({
      isloaded: true
    });
  }

  componentDidMount() {
    this.getRecords();
    this.props.info.getRecords(dataArr);
  }

  // Called whenever a new dataset is loaded
  componentDidUpdate(prevProps) {
  if (this.props.info.dataset !== prevProps.info.dataset)
    this.getRecords();
}

  render() {
    let {isloaded, error} = this.state;
    if (error)
      return (<p>{error}</p>)
    else if (isloaded)
      return (<div>Done</div>)
    else {
      return (<p>Loading...</p>)
    }
  }
}
