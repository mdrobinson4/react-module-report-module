import React from 'react';

export default class GetRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isloaded: false,
      error: ''
    };
  }

  // Gets the records and stores them in this.state.records
  getRecords = () => {
    let dataset = this.props.url;
    fetch(dataset, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        'X-Okapi-Tenant': 'diku',
        'X-Okapi-Token': this.props.token
      })
    })
    .then(
      (result) => {
        result => result.json()
        console.log(result)
        // Access the items stored in the first key, which contains the data we want
        this.mergeRecords(result[Object.keys(result)[0]]);
    })
    .catch(
      (error) => {
        this.setState({
          error: error
        });
      }
    )
  }

  mergeRecords = (records) => {
    console.log('Merging Records');
    // Access each key in the instance object
    let dataArr = {};
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


    this.props.getRecords(dataArr);
    this.handleMerge();
  }

  handleMerge = () => {
    this.setState({
      isloaded: true
    });
  }

  componentDidMount() {
    this.getRecords();
  }

  // Called whenever a new dataset is loaded
  //componentDidUpdate(prevProps) {
  //if (this.props.info.dataset !== prevProps.info.dataset)
  //  this.getRecords();
  //}

  render() {
    let {isloaded, error} = this.state;

    if (error)
      return (<p>Hey</p>)

    else if (isloaded)
      return (<div>Done</div>)

    else {
      return (<p>Loading...</p>)
    }
  }
}
