import React from 'react';
import './fonts.css';
import GraphUI from './GraphUI';
import styles from './App.css';
import Plot from 'react-plotly.js';
import update from 'immutability-helper';
import Grid from './Grid.js'
import { Pane, Paneset } from '@folio/stripes-components';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          width: window.innerWidth,
          height: window.innerHeight,
          useResizeHandler: true,
            style: {
              width: '100%',
              height: '100%'
            },
            data: [{
                type: 'bar',
                opacity: 1
            }],
            layout: {
              height: 1000,
              title: String,
              xaxis: {
                title: 'String'
              },
              yaxis: {
                title: String
              }
            },
            defaultHeight: 500,
            defaultWidth: 1000,
            graphTypes: ['Bar', 'Line', 'Pie'],
            okapiToken: String,
            records: [],
            propertyObjectArray: [],
            isLoaded: Boolean,
            dataSets: [
                {name: 'Inventory', url: 'http://localhost:9130/instance-storage/instances?limit=500&query=%28title%3D%22%2A%22%20or%20contributors%20adj%20%22%5C%22name%5C%22%3A%20%5C%22%2A%5C%22%22%20or%20identifiers%20adj%20%22%5C%22value%5C%22%3A%20%5C%22%2A%5C%22%22%29%20sortby%20title'},
                {name: 'Users', url: 'http://localhost:9130/users?limit=500&query=%28cql.allRecords%3D1%29%20sortby%20personal.lastName%20personal.firstName'}
            ],
            body: JSON.stringify({
                'username': 'diku_admin',
                'password': 'admin'
            }),
            headers: new Headers({
                'Content-type': 'application/json',
                'X-Okapi-Tenant': 'diku',
            }),
        }
        this.dataArr = [];
        this.longRecords = [];
        this.graphTitle = '';
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onAxisChange = this.onAxisChange.bind(this);
        this.swapAxes = this.swapAxes.bind(this);
        this.updateOpacity = this.updateOpacity.bind(this);
        this.getRecords = this.getRecords.bind(this);
        this.setGraphObjData = this.setGraphObjData.bind(this);
        this.getCount = this.getCount.bind(this);
        this.changeGraphType = this.changeGraphType.bind(this);
        this.updateSize = this.updateSize.bind(this);
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
      fetch('http://localhost:9130/authn/login', {
        method: 'POST',
        body: this.state.body,
        headers: this.state.headers
      })
      .then((res) => this.getRecords(res.headers.get('x-okapi-token'), 0))  // Use the okapi-token to make an api request to the backend and get the records
      this.handleResize();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    /*  Updates the height and width of graph  */
    handleResize = () => {
      this.setState(update(this.state, {
        layout: {width: {$set: window.innerWidth * 0.8},
        height: {$set: window.innerWidth * 0.8 * 0.642857143 }
      }}));
    }

    updateSize = e => {
      this.setState(update(this.state, {
        layout: {
          width: {$set: e.target.value},
          height: {$set: e.target.value * 0.642857143 }
        }}));
    }

    changeGraphType(newType) {
        let newGraph = [{}];

        newType = newType.toLowerCase();

        if (newType === 'pie') {
             newGraph = [{
                labels: this.state.data[0].x,
                values: this.state.data[0].y,
                type: newType,
                opacity: this.state.data[0].opacity
            }]
        }
        else if (this.state.data[0].type === 'pie') {
             newGraph = [{
                x: this.state.data[0].labels,
                y: this.state.data[0].values,
                type: newType,
                opacity: this.state.data[0].opacity
            }]
        }
        else {
            newGraph = [{
                x: this.state.data[0].x,
                y: this.state.data[0].y,
                type: newType,
                opacity: this.state.data[0].opacity
            }]
        }
        this.setState({data: newGraph})
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

    swapAxes() {
        var swap = [{
            x: this.state.data[0].y,
            y: this.state.data[0].x,
            type: this.state.data[0].type,
            opacity: this.state.data[0].opacity
        }]

        this.setState({ data: swap })
    }

    updateOpacity(e) {
        var newOpacity = e.target.value;

        newOpacity /= 100;

        var temp = [{
            x: this.state.data[0].x,
            y: this.state.data[0].y,
            type: this.state.data[0].type,
            opacity: newOpacity
        }]

        this.setState({ data: temp })
    }

    // arr is an array of objects with data with identical properties
    setGraphObjData(arr) {
        var propertyArray = Object.getOwnPropertyNames(arr[0]); // array of properties from the first set of data in arr
        // iterate through each property from arr
        propertyArray.forEach(element => {
            var propertyObject = {
                type: element,
                data: [ ]
            };
            // Iterate each dataset, storing each object of data in element
            arr.forEach(element => {
                var temp = Object.getOwnPropertyDescriptor(element, propertyObject.type)
                propertyObject.data.push(temp.value)
            });
            this.state.propertyObjectArray.push(propertyObject);
        });
    }

    /* Returns an object which contains the data from the first set */
    selectFirstSet = () => {
      let e = this.state.propertyObjectArray[0].data;
      let type = this.state.propertyObjectArray[0].type;
      let defaultSet = {
        x: {values: e, type: type},
        y: {values: this.getCount(e), type: type}, // Set the y axis as the count of the x value
      }
      return defaultSet;
    }

    updateAxesLabels(axes) {
      let newLayout = {
        title: this.graphTitle.toUpperCase(),
        xaxis: {
          title: axes.x.type
        },
        yaxis: {
          title: axes.y.type
        }
      }
      this.setState({layout: newLayout})
    }

    /* Updates the x and y values and the axis labels */
    onAxisChange(e) {
      var axes = e;
      var temp = [{
        x: axes.x.values,
        y: axes.y.values,
          type: this.state.data[0].type,
        opacity: this.state.data[0].opacity
      }]
      this.updateAxesLabels(axes)
      this.setState({ data: temp })
    }

    /*  Store the records in state as an array of objects and store the name of the data and the actual data in the each object */
    setGraphObj = (title) => {
      this.graphTitle = title;
      let propertyArray = Object.keys(this.dataArr[title]); // array of properties from the first key's value
      let res = [];
      // Iterate the properties
      for (let prop of propertyArray) {
        let propertyObject = {
          type: prop,
          data: []
        }
        // Pass through the corresponding array of data and push values into propertyObject
        for (let val of this.dataArr[title][prop])
          propertyObject.data.push(val);
        res.push(propertyObject);
      }
      this.updateRecords(update(this.state, {propertyObjectArray: {$set: res}}));
    }

    /* Pretty obvious */
    changeSet = (e) => {
      this.setGraphObj(e.target.value);
    }

    /* Update state */
    updateRecords = (newRecords) => {
      this.setState(newRecords, () => {this.onAxisChange(this.selectFirstSet())});
    }

    /*  Make an API request to the backend to get the records   */
    getRecords = (okapiToken, i) => {
      // Base case -> return if you reach the end of the dataSets array
      if (i === this.state.dataSets.length) {
        this.setGraphObj(this.state.dataSets[0].name);  // Create graph for first set
        return;
      }
      // Iterate through the dataset URLs provided in state
      fetch(this.state.dataSets[i].url, {
        method: 'GET',
        headers: new Headers({
          'Content-type': 'application/json',
          'X-Okapi-Tenant': 'diku',
          'X-Okapi-Token': okapiToken
        })
      })
      .then(result => result.json())  // Parse json to javascript
      .then(result => this.mergeRecords(result[Object.keys(result)[0]], this.state.dataSets[i].name))  // Organize the data into an object of arrays where the keys are the names of the column of data and the values are the data
      .then(() => this.getRecords(okapiToken, i + 1)) // Recursively get records
      //.then(result => this.mergeLong(result[Object.keys(result)[0]], this.state.dataSets[i].name))
    }

    // Pass through each object which has several sub-objects with data and store data with dup names together
    mergeRecords = (records, title) => {
      let dataArr = {};
      for (let obj of records) {
        for (let prop of Object.keys(obj)) {
          if (!dataArr.hasOwnProperty(prop))  // Check to see if the key already exists
            dataArr[prop] = [];
          dataArr[prop].push(obj[prop]);
        }
      }
      this.dataArr[title] = dataArr;
      this.longRecords[title] = records;
    }

  makeData = () => {
  	return [
  		{
  			firstName: "judge",
  			lastName: "babies",
  			age: 16
  		},
  		{
  			firstName: "quarter",
  			lastName: "driving",
  			age: 17
  		}
  	];
  }

  promoteValues = () => {
    let promRecords = {};
    if (this.longRecords.hasOwnProperty('Users')) {
      for (let obj of this.longRecords.Users) {
        for (let key in obj) {
          let res = this.getValues(obj, key, obj[key], 0, 0);
          if (res !== undefined && res !== null && res[0] !== null && res[0] !== undefined)
            promRecords[res[0]] = res[1];
        }
      }
    }
    console.log(promRecords);
    return promRecords;
  }

  getValues = (data, key, value, i, j) => {
    /*console.log('KEY:');
    console.log(key);
    console.log('VALUE:');
    console.log(value);*/
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      //console.log(`RETURNING: ${key} _______ ${value}`);
      return [key, value];
    }
    else if ( !(Array.isArray(value)) && (typeof value === 'object')) { // Object
      //console.log('OBJECT');
      this.getValues(data, Object.keys(value)[i], value[Object.keys(value)[i]], i++, j);
    }
    else if (Array.isArray(value)) {
      //console.log('ARRAY');
      this.getValues(data, j, value[j], i, j++);
    }
    else
      return null;
  }
    render() {
      console.log(this.longRecords.Users);
      this.promoteValues();
        return (
          <Paneset>
            <Pane defaultWidth="20%" paneTitle="Filters">
              <GraphUI
                  name={this.graphTitle}
                  changeAxis={this.onAxisChange}
                  graphData={this.state.data[0]}
                  axisData={this.state.propertyObjectArray}
                  swapAxes={this.swapAxes}
                  updateOpac={this.updateOpacity}
                  updateSize={this.updateSize}
                  opacity={this.state.opacity}
                  changeType={this.changeGraphType}
                  values={this.state.graphTypes}
                  sets={Object.keys(this.dataArr)}
                  changeSet={this.changeSet}
                  width={this.state.layout.width}
                  defaultHeight={this.state.layout.height}
                  x={this.props.handleResize}
              />
            </Pane>
            <Pane defaultWidth="fill" paneTitle="Search Results">
              <Plot
                data={this.state.data}
                layout={this.state.layout}
                useResizeHandler={this.state.useResizeHandler}
                style={this.state.style}
              />
              <Grid title={this.graphTitle} longData={this.longRecords} />
            </Pane>
        </Paneset>
        );
    }
}
