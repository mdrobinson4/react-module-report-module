import React from 'react';
import './fonts.css';
import GraphUI from '../GraphUI';
import styles from './Main.css';
import Plot from 'react-plotly.js';
import update from 'immutability-helper';
import Grid from '../Grid'
import { Pane, Paneset } from '@folio/stripes-components';
import { stripesShape } from '@folio/stripes-core/src/Stripes';
import PropTypes from 'prop-types';


export default class Main extends React.Component {

    static manifest = {
      'users': {
        'type': 'okapi',
        'path': 'users?limit=1000&query=%28cql.allRecords%3D1%29%20sortby%20personal.lastName%20personal.firstName'
      },
      'statisticalCodeTypes': {
        'type': 'okapi',
        'path': 'inventory/instances?limit=1000&query=%28title%3D%22undefined%2A%22%20or%20contributors%20adj%20%22%5C%22name%5C%22%3A%20%5C%22undefined%2A%5C%22%22%20or%20identifiers%20adj%20%22%5C%22value%5C%22%3A%20%5C%22undefined%2A%5C%22%22%29%20sortby%20title'
      },
      'instances': {
        'type': 'okapi',
        'path': 'statistical-code-types?limit=1000&query=cql.allRecords=1%20sortby%20name'
      },
      'issuanceModes': {
        'type': 'okapi',
        'path': 'modes-of-issuance?limit=1000&query=cql.allRecords=1%20sortby%20name'
      },
      'catalogingLevels': {
        'type': 'okapi',
        'path': 'cataloging-levels?limit=1000&query=cql.allRecords=1%20sortby%20name'
      },
      'instanceStatuses': {
        'type': 'okapi',
        'path': 'instance-statuses?limit=1000&query=cql.allRecords=1%20sortby%20name'
      },
      'instanceRelationshipTypes': {
        'type': 'okapi',
        'path': 'instance-relationship-types?limit=1000&query=cql.allRecords=1%20sortby%20name'
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
      },
      'notifications': {
        'type': 'okapi',
        'path': 'notify'
      },
    }
    constructor(props) {
        super(props);
/*        this.connectedPlot = props.stripes.connect(Plot);
        this.connectedGraphUI = props.stripes.connect(GraphUI);
        this.connectedGrid = props.stripes.connect(Grid);       */
        this.state = {
          title: '',
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
            records: [],
            propertyObjectArray: [],
            isLoaded: Boolean,
        }
        this.dataArr = [];
        this.longRecords = [];
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onAxisChange = this.onAxisChange.bind(this);
        this.swapAxes = this.swapAxes.bind(this);
        this.updateOpacity = this.updateOpacity.bind(this);
        this.setGraphObjData = this.setGraphObjData.bind(this); this.getCount = this.getCount.bind(this); this.changeGraphType = this.changeGraphType.bind(this);
        this.updateSize = this.updateSize.bind(this);

        this.flatRecords = {};
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
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
    setGraphObjData(arr) { var propertyArray = Object.getOwnPropertyNames(arr[0]); // array of properties from the first set of data in arr
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
        title: this.state.title.toUpperCase(),
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
      this.setState({title: title});
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

    changeSet = (e) => {
      this.setGraphObj(e.target.value);
      console.log(this.state.propertyObjectArray);
    }

    /* Update state */
    updateRecords = (newRecords) => {
      this.setState(newRecords, () => {this.onAxisChange(this.selectFirstSet())});
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

  promoteValues = () => {
    this.flatRecords = {};
    for (let key in this.longRecords) {
      if (this.longRecords.hasOwnProperty(key)) {
        for (let obj of this.longRecords[key]) {
          if (!this.flatRecords.hasOwnProperty(key))
            this.flatRecords[key] = [];
            this.flatRecords[key].push(this.flatten(obj));
        }
      }
    }
  }

  flatten = (ob) => {
  	let toReturn = {};
  	for (let i in ob) {
  		if (!ob.hasOwnProperty(i)) continue;
  		if ((typeof ob[i]) === 'object') {
  			let flatObject = this.flatten(ob[i]);
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

    render() {
      console.log(this.props);
      this.promoteValues();
        return (
          <Paneset>
            <Pane defaultWidth="20%" paneTitle="Controls">
              <GraphUI
                  name={this.title}
                  changeAxis={this.onAxisChange}
                  data={this.props.resources}
                  axisData={this.state.propertyObjectArray}
                  swapAxes={this.swapAxes}
                  updateOpac={this.updateOpacity}
                  updateSize={this.updateSize}
                  opacity={this.state.opacity}
                  changeType={this.changeGraphType}
                  values={this.state.graphTypes}
                  changeSet={this.changeSet}
                  width={this.state.layout.width}
                  defaultHeight={this.state.layout.height}
                  x={this.props.handleResize}
              />
            </Pane>
            <Pane defaultWidth="fill" paneTitle="Plot">
              <Plot
                data={this.p}
                layout={this.state.layout}
                useResizeHandler={this.state.useResizeHandler}
                style={this.state.style}
              />
              <Grid title={this.state.title} data={this.flatRecords} />
            </Pane>
        </Paneset>
        );
    }
}
