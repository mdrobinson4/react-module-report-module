import React from 'react'
import Plot from 'react-plotly.js'
import update from 'immutability-helper'
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import { Pane, Paneset } from '@folio/stripes-components';

export default class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {key: 'value'}
    };
  }

  getColumns = () => {
    let columns = [];
    let table = [];
    for (let property in this.props.longData.Inventory) {
      columns.push({Header: property.toUpperCase(), accessor: property});
    }
    table.push({Header: this.props.title, columns: columns});
    return table;
  }
/*
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.data != undefined && this.props.data != this.state.data)
      this.setState({data: this.props.data});
    else if (this.props.data == undefined)
      this.setState({data: this.props.data});
  }
*/
  render() {

    let catalogResults = [
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

      //catalogResults = undefined;


    console.log(this.state.data);
    console.log(this.state.title);
    let visibleColumns = [];

    switch (this.props.title) {
      case 'Users':
        visibleColumns = ['active', 'city', 'countryId', 'region', 'postalCode', 'primaryAddress', 'preferredContactTypeId'];
        break;
      case 'Inventory':
        visibleColumns = ['createdByUserId', 'createdDate', 'id', 'source', 'title', 'updatedDate', 'value'];
        break;
      default:
        visibleColumns = null;
    }
    console.log(visibleColumns);
    return (
      <div>
        <MultiColumnList
            contentData={catalogResults}
            visibleColumns={['title', 'id']}
        />
			</div>
    )
  }
}
