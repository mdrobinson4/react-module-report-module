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

    // List of resources to get from Folio backend
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
          size: window.innerWidth * 0.8,
          data: [{ type: 'bar', opacity: 1 }],
          layout: {
            autosize: true,
            title: '',
            xaxis: { title: '' },
            yaxis: {title: ''}
          },
          defaultHeight: 500,
          defaultWidth: 1000,
          graphTypes: ['Bar', 'Line', 'Pie'],
          records: [],
          propertyObjectArray: [],
          hasLoaded: false,
          checkboxData: [],
          xValues: [],
          x: [ {values: [], active: false} ],
          y: [ {values: [], active: false} ]
        };
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
      let keys = Object.keys(this.props.resources);
      let initialSet = {target: {value: 'users'}};   // Set users as the default set
      if (this.state.hasLoaded === false && this.props.resources[keys[0]].hasLoaded === true) {
        this.changeSet(initialSet);
        this.setState({hasLoaded: true});
      }
    }

    /*
      This function is responsible for updating the size of the plotly chart.
      It directly updates the width and height attributes in the layout object
    */
    updateSize = (e) => {
    let sizeMultiplier = e.target.value;
    let newHeight = this.state.defaultHeight;
    let newWidth = this.state.defaultWidth;

    newHeight *= (sizeMultiplier / 100);
    newWidth *= (sizeMultiplier / 100);

    var newLayout = {
        //height: newHeight,
        //width: newWidth,
        title: this.state.layout.title,
        xaxis: this.state.layout.xaxis,
        yaxis: this.state.layout.yaxis
    };

    this.setState({layout: newLayout});
}
    // Gets the values in the first checkbox and graphs it
    getDefault = (e) => {
      let defaultSet = {
        x: {values: e},
        y: {values: this.getCount(e)} // Set the y axis as the count of the x value
      };
      return defaultSet;
    }

    // Returns an object which has the number of times each value appeared
  getCount = (arr) => {
    if (arr.length === 0)
      return [];
    let uniqueValues = new Map();
    let count = 0;
    let countArr = [];
    let indices = {};
    let fullCount = [];
    for (var x = 0; x < arr.length; x++) {
        if (uniqueValues.has(arr[x])) { //check first to see if the map contains a given value, if not add it and initialize to count of 1
          count = uniqueValues.get(arr[x]);
          count++;
          uniqueValues.set(arr[x], count);
          indices[arr[x]].push(x);
        }
        else {
          if (arr[x] !== undefined) {
            uniqueValues.set(arr[x], 1);
            indices[arr[x]] = [];
            indices[arr[x]].push(x);
          }
        }
    }

    uniqueValues.forEach((key, value) => { //iterate over map and push values to new array
      for (let index of indices[value])
        fullCount[index] = key;
      countArr.push(key);
    });

    let initialMode = { //create a base pair from the map and initial array
      key: arr[0],
      value: countArr[0]
    }
    this.findMode(uniqueValues, initialMode);
    return {unique: countArr, all: fullCount, indices: indices};
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
    if (arr.length === 0)
      return [];
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
    updateGraph = (data, xValues) => {
      console.log(data);
      this.setState(update(this.state, {
        x: {$set: data.x},
        y: {$set: data.y},
        xValues: {$set: data.x.values},
        layout: {
          title: {$set: this.state.title.toUpperCase()},
          xaxis: {title: {$set: data.x.type}},
          yaxis: {title: {$set: data.y.type}}
        }
      }), () => {this.changeGraphType(this.state.data[0].type)});
    }

    // called from the Dropdown component when graph type is changed. Might need to be moved into its own component to improve performance if more graph types are incorporated
    changeGraphType = (gType) => {
      let type = gType.toLowerCase();
      if (type === 'pie')
        this.pie(type);
      else if (type === 'histogram')
        this.histogram(type);
      else
        this.barLine(type);
    }

    barLine = (type) => {
      let data = [];
        data.push({
            x: this.state.x[0].values,
            y: this.state.y[0].values,
            type: type,
            opacity: this.state.data[0].opacity
        });
        // Second set of data
        if (this.state.x[0].active === true && this.state.x[1].active === true) {
            data.push({
                x: this.state.x[1].values,
                y: this.state.y[1].values,
                type: type,
                opacity: this.state.data[0].opacity
            });
        }
        this.setState(update(this.state, {
            data: {$set: data},
            layout: {barmode: {$set: "stacked"}}
        }));
    }

    // Creates histogram graph
    histogram = () => {
      let data = [];
      data.push({
        x: this.state.xValues,
        type: "histogram",
        opacity: this.state.data[0].opacity
      });

      if (this.state.x[0].active === true && this.state.x[1].active === true) {
        data.push({
          y: this.state.y.values,
          type: "histogram",
          opacity: 0.5
        })
      }
      this.setState(update(this.state, {
        data: {$set: data},
        layout: {barmode: {$set: "stacked"}}
      }));
    }

    // Creates  pie chart
    pie = () => {
      if (this.state.x[0].active === true && this.state.x[1].active === true) {
        //alert('ALERT');
        for (let values of this.state.x[0].values) {

        }
      }
      this.setState(update(this.state, {
        data: {
          $set: [{
            labels: this.state.x[0].values,
            values: this.state.y[0].values,
            type: 'pie',
            opacity: this.state.data[0].opacity
          }]
        }
      }));

    }

    /*  Make the records one-dimensional  */
    flattenRecords = (ob) => {
      let toReturn = {};  // final result
      for (let i in ob) { // Iterate each key / value pair in the set
        if (!ob.hasOwnProperty(i)) continue;  // Skip if the initial object has key
        if ((typeof ob[i]) === 'object') {    // Go a level lower if value is an array or object
          let flatObject = this.flattenRecords(ob[i]);   // Go a level lower
          for (let x in flatObject) {
            if (!flatObject.hasOwnProperty(x)) continue;
               toReturn[x] = flatObject[x];
          }
        }
        else
          toReturn[i] = ob[i];
      }
      return toReturn;
    };

    /*  Store the records in state as an array of objects and store the name of the data and the actual data in the each object */
    setGraphObj = (title) => {
      let data = this.props.resources;
      let records = [];

      // Make all of the records at the same level
      data[title].records[0][title].forEach( (obj) => {
        records.push(this.flattenRecords(obj));
      });
      let res = [];
      let props = new Set([]);

      records.forEach((obj) => {
        for (let prop in obj) {
          props.add(prop);
        }
      });
      // Iterate the properties
      for (let prop of [...props]) {
        let propertyObject = {
          type: prop,
          data: []
        }
        // Pass through the corresponding array of data and push values into propertyObject
        records.forEach( (obj) => {
          propertyObject.data.push(obj[prop]);
        });
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
                  graphType={this.state.data[0].type}
              />
              </Pane>
            <Pane defaultWidth="fill" paneTitle="Graph And Table" >
              <Plot
                data={this.state.data}
                layout={this.state.layout}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
              />
              <Grid
                title={this.state.title}
                resources={this.props.resources}
                flattenRecords={this.flattenRecords}
              />
            </Pane>
          </Paneset>
        );
    }
}
