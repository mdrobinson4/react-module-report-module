import React from 'react';
import GraphUI from './GraphUI'
import GetRecords from './GetRecords'

const datasets = [
  {name: 'Circulation', url: 'http://localhost:9130/instance-storage/instances?limit=500&query=%28title%3D%22%2A%22%20or%20contributors%20adj%20%22%5C%22name%5C%22%3A%20%5C%22%2A%5C%22%22%20or%20identifiers%20adj%20%22%5C%22value%5C%22%3A%20%5C%22%2A%5C%22%22%29%20sortby%20title'},
  {name: 'Users', url: 'http://localhost:9130/users?limit=500&query=%28cql.allRecords%3D1%29%20sortby%20personal.lastName%20personal.firstName'}
];

export default class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        okapiToken: '',
        dataset: {
          url: datasets[0].url,
          name: datasets[0].name
        },
        isloaded: false,
        getRecords: (result) => {
          this.setState({
            records: result,
            isloaded: true
          });
        },
        records: [],
        graphData: {
          data: [{
            x: ['Dog', 'Cat'],
            y: [1, 2],
            type: 'bar'
          }],
          layout: {
            height: 500,
            width: 1000,
            title: 'Sample Graph'
          }
        },
      }
    }

    componentDidMount() {
      fetch('http://localhost:9130/authn/login', {
        method: 'POST',
        body: JSON.stringify({
          'username': 'diku_admin',
          'password': 'admin'
        }),
        headers: new Headers({
          'Content-type': 'application/json',
          'X-Okapi-Tenant': 'diku',
        })
      })
      .then((res) => {
        this.setState({
          okapiToken: res.headers.get('x-okapi-token'),
          isLoaded: true
        });
      });
    }

    changeData = (e) => {
      this.setState({
        dataset: {
          value: e.target.value,
          name: e.target.label
        }
      });
    }

    render() {
      let {records, isloaded} = this.state;
      let options = datasets.map(data => ({
        value: data.url,
        label: data.name
      }));

      if (this.props.showSettings)
        return <Settings {...this.props} />;

      // Go to PLOTLY -> this.state.records
      if (isloaded) {
        console.log(records);
        return <div>PLOTLY IS NEXT!!</div>
      }

      else if (this.state.okapiToken)
        return <GetRecords info={this.state} />

      else
        return <div>Loading</div>
    }
  }
