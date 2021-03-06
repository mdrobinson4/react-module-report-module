import React from 'react'
import Plot from 'react-plotly.js'
import update from 'immutability-helper'
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList'
import { Pane, Paneset } from '@folio/stripes-components'

// Import React Table
import ReactTable from "react-table"
import './react-table.css'



export default class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      title: '',
    };
    // Includes the columns that we want to display
    this.visibleColumns = {
      //inventory: ['title', 'createdByUserId', 'createdDate', 'id', 'source'],
      //users: ['active', 'city', 'countryId', 'region', 'postalCode', 'primaryAddress', 'preferredContactTypeId']
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
          this.flatRecords[title].push(this.props.flattenRecords(records[title][i]));    // Create an array of flat records
          }
        }
        this.setState({data: this.flatRecords[this.props.title]}, () => {this.updateColumns(this.props.title, this.flatRecords[this.props.title])});
        //this.updateColumns(this.props.title, this.flatRecords[this.props.title]);
    }
  }

  // Set the columns for table
  updateColumns = (title, records) => {
    let columns = [];
    for (let key in records[0]) {   // Iterate through the keys
    if (title in this.visibleColumns) {   // Check if we have specified which columns to display
      if (this.visibleColumns[title].includes(key)) // Only display specified columns
        columns.push({Header: key.toUpperCase(), accessor: key, width: this.getColumnWidth(key, key)});
    }
    else  // Otherwise display all columns
      columns.push({Header: key.toUpperCase(), accessor: key, width: this.getColumnWidth(key, key)});
    }
    this.setState({columns: columns, title: title});
  }

  handleTableClick = () => {
    console.log('EVENT HERE');
  }

  getColumnWidth = (accessor, headerText) => {
    let {data} = this.state;
    let max = 0;
    const maxWidth = 400;
    const magicSpacing = 18;

    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && data[i][accessor] !== null) {
        if (JSON.stringify(data[i][accessor] || 'null').length > max) {
          max = JSON.stringify(data[i][accessor] || 'null').length;
        }
      }
    }
    //console.log(Math.min(maxWidth, Math.max(max, headerText.length) * magicSpacing));
    return Math.min(maxWidth, Math.max(max, headerText.length) * magicSpacing);
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
