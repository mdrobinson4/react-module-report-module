import React from 'react'
import Plot from 'react-plotly.js'
import update from 'immutability-helper'
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList'
import { Pane, Paneset } from '@folio/stripes-components'

// Import React Table
import ReactTable from "react-table"
import "./reactTable.css"

export default class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      columns: []
    };
    // Includes the columns that we want to display
    this.visibleColumns = {
      Inventory: ['title', 'createdByUserId', 'createdDate', 'id', 'source'],
      Users: ['active', 'city', 'countryId', 'region', 'postalCode', 'primaryAddress', 'preferredContactTypeId']
    };
  }

  // Set the columns for table
  updateColumns = () => {
    let columns = [];
    for (let key in this.props.data[0]) {
      if (this.visibleColumns[this.props.title].includes(key))
        columns.push({Header: key.toUpperCase(), accessor: key});
    }
    this.setState({columns: columns});
  }

  // Simply updates the data
  updateData = () => {
    this.setState({data: this.props.data});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((this.props.data !== undefined && this.props.data != prevProps.data)) {
      this.updateData();
      this.updateColumns();
    }
    else if (this.props.data != prevProps.data)  {
      this.setState({data: this.props.data, columns: []});
    }
  }

  render() {
    return (
          <ReactTable
            data={this.state.data}
            columns={this.state.columns}
            defaultPageSize={10}
            className="-striped -highlight"
          />
    )
  }
}
