import React from 'react';
import './fonts.css';
import GraphUI from '../GraphUI';
import styles from './Main.css';
import Plot from 'react-plotly.js';
import update from 'immutability-helper';
import Grid from '../Grid'
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { stripesShape } from '@folio/stripes-core/src/Stripes';
import PropTypes from 'prop-types';

export default class Main extends React.Component {

    static manifest = {
      'users': {
        'type': 'okapi',
        'path': 'users?limit=1000&query=%28cql.allRecords%3D1%29%20sortby%20personal.lastName%20personal.firstName'
      },
      'locations': {
        'type': 'okapi',
        'path': 'locations?limit=1000&query=cql.allRecords=1%20sortby%20name'
      },
      'classificationTypes': {
        'type': 'okapi',
        'path': 'classification-types?limit=1000&query=cql.allRecords=1%20sortby%20name'
      },
      'instanceTypes': {
        'type': 'okapi',
        'path': 'instance-types?limit=1000&query=cql.allRecords=1%20sortby%20name'
      },
      'instanceFormats': {
        'type': 'okapi',
        'path': 'instance-formats?limit=1000&query=cql.allRecords=1%20sortby%20name'
      },
      'contributorNameTypes': {
        'type': 'okapi',
        'path': 'contributor-name-types?limit=1000&query=cql.allRecords=1%20sortby%20ordering'
      },
      'contributorTypes': {
        'type': 'okapi',
        'path': 'contributor-types?limit=1000&query=cql.allRecords=1%20sortby%20name'
      },
      'identifierTypes': {
        'type': 'okapi',
        'path': 'identifier-types?limit=1000&query=cql.allRecords=1%20sortby%20name'
      }
    }

    constructor(props) {
        super(props);
        this.state = {
          title: '',
          useResizeHandler: true,
          size: window.innerWidth * 0.8,
          style: { width: '100%', height: '100%' },
          data: [{ type: 'bar', opacity: 1 }],
          layout: {
            height: 1000,
            title: '',
            xaxis: { title: '' },
            yaxis: {title: String}
          },
          defaultHeight: 500,
          defaultWidth: 1000,
          graphTypes: ['Bar', 'Line', 'Pie'],
          records: [],
          propertyObjectArray: [],
          hasLoaded: false,
          checkboxData: [],
        };
        this.currWidth = window.innerWidth;
        this.currHeight = window.innerHeight;
        this.checkboxDataMem = [];
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
      //this.handleWindowResize();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.currWidth !== window.innerWidth || this.currHeight !== window.innerHeight) {
        if (!(isNaN(this.props.width)) === true) {
          this.setState(update(this.state, {size: {$set: Number(this.props.width)}})); // Update the slider with the value from the window changing
        }
        this.currWidth = window.innerWidth;
        this.currHeight = window.innerHeight;
      }

      let keys = Object.keys(this.props.resources);
      let initialSet = {target: {value: 'users'}};   // Set users as the default set
      if (this.state.hasLoaded === false && this.props.resources[keys[0]].hasLoaded === true) {
        this.changeSet(initialSet);
        this.setState({hasLoaded: true});
      }
    }

    /*  Size is updated by window resizing  */
    /*handleWindowResize = () => {
      this.setState(update(this.state, {
        layout: {width: {$set: window.innerWidth * 0.8},
        height: {$set: window.innerWidth * 0.8 * 0.642857143 }
      }}));
    }*/

    /*  Size is updated by the slider  */
    /*updateSize = e => {
      this.setState(update(this.state, {
        size: {$set: e.target.value},
        layout: {
          width: {$set: e.target.value},
          height: {$set: e.target.value * 0.642857143 }
        }}));
    }*/

    updateSize = (e) => {
    let sizeMultiplier = e.target.value;
    let newHeight = this.state.defaultHeight;
    let newWidth = this.state.defaultWidth;

    newHeight *= (sizeMultiplier / 100);
    newWidth *= (sizeMultiplier / 100);

    var newLayout = {
        height: newHeight,
        width: newWidth,
        title: this.state.layout.title,
        xaxis: this.state.layout.xaxis,
        yaxis: this.state.layout.yaxis
    };

    this.setState({layout: newLayout});
}

    // called from the Dropdown component when graph type is changed. Might need to be moved into its own component to improve performance if more graph types are incorporated
    changeGraphType = (newType) => {

      let newGraph = [{}];
      newType = newType.toLowerCase();

      if (newType === 'pie') {

           newGraph = [{
              labels: this.state.data[0].x,
              values: this.state.data[0].y,
              type: newType,
              opacity: this.state.data[0].opacity
          }];
      }
      else if (newType === 'histogram') {
        this.setState({yDefaultValues : this.state.data[0].y});

        newGraph = [{
          x: this.state.data[0].x,
          type: newType,
          opacity: this.state.data[0].opacity
        }];
      }
      else if (this.state.data[0].type === 'histogram') {

        newGraph = [{
          x: this.state.data[0].x,
          y: this.state.yDefaultValues,
          type: newType,
          opacity: this.state.data[0].opacity
        }];
      }
      else if (this.state.data[0].type === 'pie') {

        newGraph = [{
            x: this.state.data[0].labels,
            y: this.state.data[0].values,
            type: newType,
            opacity: this.state.data[0].opacity
        }];
      }
      else {

          newGraph = [{
              x: this.state.data[0].x,
              y: this.state.data[0].y,
              type: newType,
              opacity: this.state.data[0].opacity
          }];
      }
      this.setState({data: newGraph});
    }

    getDefault = (e) => {
      let defaultSet = {
        x: {values: e},
        y: {values: this.getCount(e)} // Set the y axis as the count of the x value
      };
      return defaultSet;
    }

  getCount = (arr) => {
    console.log('COUNT');
    let uniqueValues = new Map();
    let count = 0;
    let countArr = [];
    for (var x = 0; x <= arr.length; x++) {
        if (uniqueValues.has(arr[x])) { //check first to see if the map contains a given value, if not add it and initialize to count of 1
          count = uniqueValues.get(arr[x]);
          count++;
          uniqueValues.set(arr[x], count);
        }
        else {
          if (arr[x] !== undefined) uniqueValues.set(arr[x], 1)
        }
    }
    uniqueValues.forEach(function (value) { //iterate over map and push values to new array
      countArr.push(value);
    })
    let initialMode = { //create a base pair from the map and initial array
      key: arr[0],
      value: countArr[0]
    }
    this.findMode(uniqueValues, initialMode);
    return countArr;
  }

  findMode = (map, initialMode) => {
    let max = initialMode.value;
    let mode = initialMode;

    map.forEach(function (value, key) { //iterate over the map and find the max value
      if (value > max) {
        mode.key = key;
        mode.value = value;
        max = value;
      }
    });

    this.setState({xAxisMode : mode});
  }

  getFreq = (arr) => {
    console.log('FREQUENCY');
    let uniqueValues = new Map();
    let count = 0;
    let freqArr = [];

    for (var x = 0; x <= arr.length; x++) {
        if (uniqueValues.has(arr[x])) { //check first to see if the map contains a given value, if not add it and initialize to count of 1
          count = uniqueValues.get(arr[x]);
          count++;
          uniqueValues.set(arr[x], count);
        }
        else {
          uniqueValues.set(arr[x], 1);
        }
    }

    uniqueValues.forEach(function (value) { //iterate over map and push values to new array
      let freq = value / arr.length;

      freq *=  100;
      freq = freq.toFixed(2);

      freqArr.push(freq);
    });

    return freqArr;
  }


    getCount(arr) {
        var lastElement = arr[0];
        var count = 1;

        var countArr = [];

        for (var x = 1; x <= arr.length; x++) {
            if (arr[x] === lastElement) {
                count++;
            }
            else {
                countArr.push(count);
                count = 1;
                lastElement = arr[x];
            }
        }
        return countArr;
      }

      removeDuplicates = (arr) => {
        var noDupes = [];
        noDupes.push(arr[0])
        var lastElement = arr[0];

        for (var x = 1; x < arr.length; x++) {
            if (arr[x] !== lastElement) {
                noDupes.push(arr[x]);
                lastElement = arr[x];
            }
        }
        return noDupes;
    }

    setOpacity = e => {
      let opacity = e.target.value / 100;
      let newData = [{
          x: this.state.data[0].x,
          y: this.state.data[0].y,
          type: this.state.data[0].type,
          opacity: opacity
      }];
      this.setState({ data: newData });
    }

    /* Updates the x and y values and the axis labels */
    updateGraph = (data) => {
      let newData = [{
        x: data.x.values,
        y: data.y.values,
        type: this.state.data[0].type,
        opacity: this.state.data[0].opacity
      }];

      let newLayout = {
        title: this.state.title.toUpperCase(),
        xaxis: {
          title: data.x.type
        },
        yaxis: {
          title: data.y.type
        }
      }
      this.setState({layout: newLayout, data: newData});
    }

    /*  Store the records in state as an array of objects and store the name of the data and the actual data in the each object */
    setGraphObj = (title) => {
      let data = this.props.resources;
      let propertyArray = Object.keys(data[title].records[0][title][0]); // array of properties from the first key's value
      let res = [];
      // Iterate the properties
      for (let prop in data[title].records[0][title][0]) {
        let propertyObject = {
          type: prop,
          data: []
        }
        // Pass through the corresponding array of data and push values into propertyObject
        for (let obj of data[title].records[0][title]) {
          propertyObject.data.push(obj[prop]);
        }
        res.push(propertyObject);
      }
      this.checkboxDataMem[title] = res;
      this.setState({title: title, checkboxData: res, title: title});
    }

    changeSet = (e) => {
      let title = e.target.value;
      if (title in this.checkboxDataMem)
        this.setState({title: title, checkboxData: this.checkboxDataMem[title]});
      else if (!(title in this.checkboxDataMem)) {
        this.setGraphObj(title);
        //this.setState({checkboxData: this.checkboxDataMem[title]});
      }
    }

    render() {
        return (
          <Paneset isRoot>
            <Pane defaultWidth="20%" paneTitle="Graph Controls" >
              <GraphUI
                  getCount={this.getCount}
                  getFreq={this.getFreq}
                  size={this.state.size}
                  opacity={this.state.data[0].opacity * 100}
                  title={this.state.title}
                  updateGraph={this.updateGraph}
                  data={this.props.resources}
                  checkboxData={this.state.checkboxData}
                  setOpacity={this.setOpacity}
                  updateSize={this.updateSize}
                  changeGraphType={this.changeGraphType}
                  values={this.state.graphTypes}
                  changeSet={this.changeSet}
                  width={this.state.layout.width}
                  defaultHeight={this.state.layout.height}
                  handleWindowResize={this.handleWindowResize}
              />
              </Pane>
            <Pane defaultWidth="fill" paneTitle="Graph And Table" >
              <Plot
                data={this.state.data}
                layout={this.state.layout}
                useResizeHandler={this.state.useResizeHandler}
                style={this.state.style}
              />


              <Grid
                title={this.state.title}
                resources={this.props.resources}
              />
            </Pane>
          </Paneset>
        );
    }
}
