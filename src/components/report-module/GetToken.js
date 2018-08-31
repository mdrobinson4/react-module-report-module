import React from 'react';
import PropTypes from 'prop-types';
import GetRecords from './GetRecords';


export default class getToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      okapiToken: ''
    };
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
      })
  };
  render() {
    if (this.state.isLoaded) {
      return (
        <div>
          <GetRecords okapiToken={this.state.okapiToken} />
        </div>
      )
    }
    else {
      return (
      <div>
        <p>Getting Okapi Token</p>
      </div>
    )
    }
  }
}
