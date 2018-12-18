import PropTypes from 'prop-types';
import React from 'react';
import Main from '../Main';
import PlotData from '../PlotData';
import GraphUI from '../GraphUI';
import Grid from '../Grid';

export default class Connect extends React.Component {
  static propTypes = {
    stripes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    // Connect Main Component
    this.connectedMain = props.stripes.connect(Main);
    this.connectedPlot = props.stripes.connect(PlotData);
    this.connectedGraphUI = props.stripes.connect(GraphUI);
    this.connectedGrid = props.stripes.connect(Grid);
  }

  render() {
    return <this.connectedMain {...this.props} />
  }
}
