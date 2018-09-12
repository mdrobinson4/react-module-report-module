import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Application from './routes/application';
import ExamplePage from './routes/example-page';
import Settings from './settings';
import Select from '@folio/stripes-components/lib/Select';
import { connect } from '@folio/stripes-connect';
import GetRecords from './components/report-module/GetRecords';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

const dataset = [
  {name: 'Circulation', url: 'http://localhost:9130/instance-storage/instances?limit=30&offset=&query=%28title%3D%22%2A%22%20or%20contributors%20adj%20%22%5C%22name%5C%22%3A%20%5C%22%2A%5C%22%22%20or%20identifiers%20adj%20%22%5C%22value%5C%22%3A%20%5C%22%2A%5C%22%22%29%20sortby%20title'},
  {name: 'Users', url: 'http://localhost:9130/users?limit=30&offset=&query=%28cql.allRecords%3D1%29%20sortby%20personal.lastName%20personal.firstName'}
];

class ReportModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      okapiToken: '',
      records: [],
      dataset: {
        name: '',
        url: ''
      }
    }
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  }

  componentWillMount() {
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
    console.log(e);
    this.setState({
      dataset: {
        value: e.target.value,
        name: e.target.label
      }
    });
  }

  let getRecords = (result) => {
    this.setState({
      records: result
    });
  }

  render() {
    console.log(this.state);
    /*
    const dataset = [
      {name: 'Circulation', url: 'http://localhost:9130/instance-storage/instances?limit=30&offset=&query=%28title%3D%22%2A%22%20or%20contributors%20adj%20%22%5C%22name%5C%22%3A%20%5C%22%2A%5C%22%22%20or%20identifiers%20adj%20%22%5C%22value%5C%22%3A%20%5C%22%2A%5C%22%22%29%20sortby%20title'},
      {name: 'Users', url: 'http://localhost:9130/users?limit=30&offset=&query=%28cql.allRecords%3D1%29%20sortby%20personal.lastName%20personal.firstName'}
    ];
    */

    let options = dataset.map(data => ({
      value: data.url,
      label: data.name
    }));

    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Select
          id={this.props.pluginType}
          placeholder='Select Dataset'
          value={this.state.dataset.name}
          dataOptions={options}
          onChange={this.changeData}
          />
        <GetRecords onUpdate={this.getRecords} okapiToken={this.state.okapiToken} />
        <Route path={`${this.props.match.path}`} exact component={Application} />
        <Route path={`${this.props.match.path}/examples`} exact component={ExamplePage} />
      </Switch>
    );
  }
}

export default ReportModule;
