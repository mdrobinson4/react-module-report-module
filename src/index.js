import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Application from './routes/application';
import ExamplePage from './routes/example-page';
import Settings from './settings';
import GetToken from './components/report-module/GetToken';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class ReportModule extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
		<GetToken />
        <Route path={`${this.props.match.path}`} exact component={Application} />
        <Route path={`${this.props.match.path}/examples`} exact component={ExamplePage} />
      </Switch>
    );
  }
}

export default ReportModule;
