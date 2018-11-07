import React from 'react';
import './fonts.css';
import GraphUI from './GraphUI';
import styles from './App.css';
import Plot from 'react-plotly.js';
import update from 'immutability-helper';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                type: 'bar',
                opacity: 1
            }],
            layout: {
                height: 500,
                width: 1000,
                title: 'Sample Graph',
                xaxis: {
                    title: String
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
            datasetArray: []
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onAxisChange = this.onAxisChange.bind(this);
        this.swapAxes = this.swapAxes.bind(this);
        this.updateOpacity = this.updateOpacity.bind(this);
        this.getRecords = this.getRecords.bind(this);
        this.createGraphData = this.createGraphData.bind(this);
        this.getCount = this.getCount.bind(this);
        this.changeGraphType = this.changeGraphType.bind(this);
        this.updateSize = this.updateSize.bind(this);
    }

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

    updateAxesLabels(axes) {
        let newLayout = {
            height: this.state.layout.height,
            width: this.state.layout.width,
            title: this.state.dataSets[1].name.toUpperCase(),
            xaxis: {
                title: axes.x.type
            },
            yaxis: {
                title: axes.y.type
            }
        }

        this.setState({layout: newLayout})
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

    getDefault = e => {
      let defaultSet = {
        x: {values: e},
        y: {values: this.getCount(e)} // Set the y axis as the count of the x value
      }
      return defaultSet;
    }

    changeSet = (e) => {
      console.log(e.target.value);
      this.createGraph(e.target.value);
      let set = this.state.propertyObjectArray[0].data;
      console.log(this.state.propertyObjectArray);
      this.onAxisChange(this.getDefault(set));
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

    updateSize(e) {
        let sizeMultiplier = e.target.value;

        let newHeight = this.state.defaultHeight;
        let newWidth = this.state.defaultWidth;

        newHeight *= (sizeMultiplier / 100);
        newWidth *= (sizeMultiplier / 100);

        let newLayout = {
            height: newHeight,
            width: newWidth,
            title: this.state.layout.title,
            xaxis: this.state.layout.xaxis,
            yaxis: this.state.layout.yaxis
        }

        this.setState({layout: newLayout});
    }

    // arr is an array of objects with data with identical properties
    createGraphData(arr) {
        let propertyArray = Object.getOwnPropertyNames(arr[0]); // array of properties from the first set of data in arr

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

  /*  Store the records in state as an array of objects and store the name of the data and the actual data in the each object */
  createGraph = (title) => {
    let propertyArray = Object.keys(this.state.datasetArray[title]); // array of properties from the first key's value
    let res = [];
    // Iterate the properties
    for (let prop of propertyArray) {
      let propertyObject = {
        type: prop,
        data: []
      }
      // Pass through the corresponding array of data and push values into propertyObject
      for (let val of this.state.datasetArray[title][prop]) {
         if (val.length > 0) propertyObject.data.push(val);

         if (typeof val === 'object' && val.length == undefined) console.log(val)
      }
      res.push(propertyObject);
    }
    this.updateRecords(update(this.state, {propertyObjectArray: {$set: res}}));
  }

    /* Update state */
    updateRecords = (newRecords) => {
      this.setState(newRecords);
    }

    /*  Make an API request to the backend to get the records   */
    getRecords = (okapiToken, i) => {
      // Base case -> graph the first key in the first datatset
      console.log(this.state.propertyObjectArray);
      if (i == 1) {
        this.createGraph(this.state.dataSets[i - 1].name);  // Create graph for first set
        let set = this.state.propertyObjectArray[0].data;
        this.onAxisChange(this.getDefault(set));
      }

      // Base case -> return if you reach the end of the dataSets array
      if (i === this.state.dataSets.length)
        return;

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
      this.updateRecords( update(this.state, {datasetArray: {[title]: {$set: dataArr}}}) );
    }

    componentDidMount() {
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
        .then((res) => this.getRecords(res.headers.get('x-okapi-token'), 0))  // Use the okapi-token to make an api request to the backend and get the records
      }

    render() {
        return (
            <div className={styles.componentFlexRow}>
                <GraphUI
                    changeAxis={this.onAxisChange}
                    axisData={this.state.propertyObjectArray}
                    swapAxes={this.swapAxes}
                    updateOpac={this.updateOpacity}
                    updateSize={this.updateSize}
                    opacity={this.state.opacity}
                    changeType={this.changeGraphType}
                    values={this.state.graphTypes}
                    sets={Object.keys(this.state.datasetArray)}
                    changeSet={this.changeSet}
                />
                <Plot data={this.state.data} layout={this.state.layout}/>
            </div>
        );
    }
}
