import React from 'react';
import './fonts.css';
import Plot from 'react-plotly.js';
import update from 'immutability-helper';
import ReactTable from "react-table";
import "react-table/react-table.css";

class Grid extends React.Component {
  constructor() {
    super();
    this.state = {

    }
  }
  render() {
    const { data } = this.state;
    return (
      <div>
        <ReactTable
          data={data}
          columns={[
            {
              Header: this.props.title,
              columns: [
                {
                  Header: "Property",
                  accessor: "property"
                },
                {
                  Header: "Value",
                  accessor: "value"
                }
              ]
            }
          ]}
          defaultSorted={[
            {
              id: "property",
              desc: true
            }
            defaultPageSize={10}
          ]}
      </div>
    )
  }
}
