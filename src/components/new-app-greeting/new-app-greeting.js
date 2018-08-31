import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export default class NewAppGreeting extends React.Component {
  render() {
    return (
      <div>
        <h2 id="stripes-new-app-greeting"><FormattedMessage id="ui-report-module.new-app.greeting" /></h2>
        <FormattedMessage id="ui-report-module.new-app.message" />
      </div>
    );
  }
}
