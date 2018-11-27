import React from 'react'
import Plot from 'react-plotly.js'
import update from 'immutability-helper'
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';

export default class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  makeData = () => {
    let data = [
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
    return data;
  }

  getColumns = () => {
    let columns = [];
    let table = [];
    for (let property in this.props.longData[0]) {
      columns.push({Header: property.toUpperCase(), accessor: property});
    }
    table.push({Header: this.props.title, columns: columns});
    return table;
  }

  render() {
    console.log(this.props.longData);
    const catalogResults = [
        { title: 'Biology Today',
          id: '199930490002',
          author: {
            firstName: 'James',
            lastName: 'Whitcomb',
          },
        },
        { title: 'Financial Matters',
          id: '199930490034',
          author: {
            firstName: 'Philip',
            lastName: 'Marston',
          },
        },
        { title: 'Modern Microbiotics',
          id: '199930490064',
          author: {
            firstName: 'Eric',
            lastName: 'Martin',
          },
        },
      ];
  const resultsFormatter = {
    contributor: item => `Name: ${item.contributor.name} Id: ${item.contributor.contributorTypeId} Text: ${item.contributor.contributorTypeText} Name-Id: ${item.contributor.contributorNameTypeId}`,
    identifiers: item => ``
  };
    return (
      <div>
        <MultiColumnList
            contentData={this.props.longData.Inventory}
            formatter={resultsFormatter}
        />
			</div>
    )
  }
}
