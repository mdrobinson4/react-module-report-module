import React from 'react';
import Plot from 'react-plotly.js';



export default class PlotData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      return dataArr;
    }

    /*  Store the records in state as an array of objects and store the name of the data and the actual data in the each object */
    setGraphObj = (title) => {
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
  }
  render() {
    return (
      <Plot
        data={this.props.graph.data}
        layout={this.props.graph.layout}
       />
    );
  }
}
