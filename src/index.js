import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Settings from './settings';
import GetToken from './components/report-module/GetToken';
import PlotData from './components/report-module/PlotData';
import App from './components/report-module/App';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class ReportModule extends React.Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <div>
        <App></App>
      </div>
    );
  }
}

export default ReportModule;
