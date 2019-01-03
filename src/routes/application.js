import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import NewAppGreeting from '../components/new-app-greeting';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Connect from '../components/Connect';


export default class Application extends React.Component {
  static propTypes = {
    stripes: PropTypes.object.isRequired
  }

  render(props) {
    return (
      <Paneset>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle="Report Module">
          <Connect {...this.props}/>
        </Pane>
      </Paneset>
    );
  }
}
