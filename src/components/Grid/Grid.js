import React from 'react'
import Plot from 'react-plotly.js'
import update from 'immutability-helper'
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList'
import { Pane, Paneset } from '@folio/stripes-components'

// Import React Table
import ReactTable from "react-table"
import 'react-table/react-table.css'



export default class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      columns: [],
      title: '',
    };
    // Includes the columns that we want to display
    this.visibleColumns = {
      inventory: ['title', 'createdByUserId', 'createdDate', 'id', 'source'],
      users: ['active', 'city', 'countryId', 'region', 'postalCode', 'primaryAddress', 'preferredContactTypeId']
      /*
      locations: [],
      statisticalCodeTypes: [],
      classificationTypes: [],
      instanceTypes: [],
      instanceFormats: [],
      contributorNameTypes: [],
      contributorTypes: [],
      identifierTypes: [],
      notifications: []
      */
    };
    this.flatRecords = {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.props.resources);
    let keys = Object.keys(this.props.resources); // Get the titles of each resource
    if (this.props.resources && this.props.resources[keys[0]] !== undefined) {  // Wait till the resources are loaded
      if (this.props.resources[this.props.title] !== undefined && this.props.title != prevProps.title) { // Check to see if a different set was selected
        this.setTable(this.props.title, this.props.resources);  // Update the table
      }
    }
  }

  /*  Update the react-table component  */
  setTable = (title, data) => {
    let records = data[title].records[0];   // Get the records
    if (records.totalRecords  > 0) {        // Check if there are values in the records
      if (!(title in this.flatRecords)) {   // If this set has not yet been stored, flatten the records and store globally
        for (let i = 0; i < records[title].length; i++) {   // Iterate each set of data in records
          if (!this.flatRecords.hasOwnProperty(title))
            this.flatRecords[title] = [];
          this.flatRecords[title].push(this.flattenRecords(records[title][i]));    // Create an array of flat records
          }
        }
        this.setState({data: this.flatRecords[this.props.title]});
        this.updateColumns(this.props.title, this.flatRecords[this.props.title]);
    }
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

  // Set the columns for table
  updateColumns = (title, records) => {
    let columns = [];
    for (let key in records[0]) {   // Iterate through the keys
    if (title in this.visibleColumns) {   // Check if we have specified which columns to display
      if (this.visibleColumns[title].includes(key)) // Only display specified columns
        columns.push({Header: key.toUpperCase(), accessor: key});
    }
    else  // Otherwise display all columns
      columns.push({Header: key.toUpperCase(), accessor: key});
    }
    this.setState({columns: columns, title: title});
  }

  handleTableClick = () => {
    console.log('EVENT HERE');
  }


  render() {
    return (
          <ReactTable
            data={this.state.data}
            columns={this.state.columns}
            defaultPageSize={10}
            className="-striped -highlight"
            getTdProps={(state, rowInfo, column, instance) => {
               return {
                 onClick: (e, handleTableClick) => {
                     this.handleTableClick();
                 }
               };
             }}
          />
    )
  }
}
