import React from 'react';
import Plot from 'react-plotly.js';
import PieSlider from './PieSlider';
import update from 'immutability-helper';
import ChooseSet from './ChooseSet';

/*
  JARGON -> (1) d2Index --- first set of data (array of values) selected (2) d3Index --- Second set of data (array of values) selected
  For every element in the array at d2Index, Find another element in the array at d3Index.
  Each chart represents each (unique) item in the array at d2Index.
*/

export default class Pie extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        layout: {
          title: '',
          grid: {rows: 1, columns: 2},
          autosize: true,
          annotations: []
        },
        style: {
          width: '100%',
          height: '100%'
        },
        useResizeHandler: true,
        viewNum: 10,
        records: [],
        size: 0,
        d2Index: 0,
        chartCount: 0
      },
      this.d3Index = -1;
      this.d2Index = -1;
      this.xxx = [];
    }

    componentDidMount() {
      this.setDS();
    }

    /*  Returns an object with the total number of records, unique labels, and each label's frequency   */
    setDS = () => {
      let labels = Object.keys(this.props.records); // store each of the record keys  EX: titles, id_numbers
      let i = 0;
      /* Iterate object of data */
      for (let key in this.props.records) {
        /*  Iterate data array values */
        let dataObj = {title: key, items: []};  // Create new object which stores the set title and the labels included
        this.xxx.push(dataObj);
        for (let value of this.props.records[key]) {
          let item = {label: value, count: 0, dupIndices: [], viewed: false};
          this.xxx[i].items.push(item);
          this.setDupIndices(item, this.xxx[i].items);
        }
        i += 1;
      }
    }

    /*  Add the index of each item with same value as currItem to currItem's dupIndices property   */
    setDupIndices = (currItem, dataArr) => {
      for (let i = 0; i < dataArr.length; i++)
        if ((dataArr[i].label === currItem.label)) {
          currItem.dupIndices.push(i);
        }
    }

    getD2Name = () => {
      return this.xxx[this.d2Index].title;
    }

    /*  Create 3 Dimensional Pie Chart = MIND not BLOWN!!  */
    set2DChart = (d2Index) => {
      let data = [{labels: [], type: 'pie', name: this.getD2Name(), hoverinfo: 'label+percent+name', grid: {row: 0, column: 0}, sort: true}];

      for (let item of this.xxx[d2Index].items) {
        data[0].labels.push(item.label);
      }

      console.log(data);
    /*  update the d3Index, row, data object and layout object  */
    this.updateState(update(this.state, {
      data: {$set: data},
      layout: {title: {$set: this.getChartTitle(d2Index)}, grid: {rows: {$set: 1}, columns: {$set: 1}}, annotations: {$set: []}},
    }));
  }

    /*  Create 3 Dimensional Pie Chart === MIND BLOWN!!  */
    setD3Pie = (d3Index) => {
      let row = 0, column = 0, rowCount = 0, i = 0, d2Index = this.d2Index;
      let newAnnotations = [], data = [];
      // Iterate through each item in the array at d2Index
      for (let item of this.getD2Set(d2Index)) {
        let newChart = this.newChart(item, row, column, this.xxx[d3Index].items);
        column += 1;
        let annotation = this.newAnnotation(i, d2Index, d3Index);
          // If the last item in a row was just added, go to a lower row and start at the first column
        if (column === 3) {
          column = 0;
          row += 1;
          rowCount += 1;
          annotation.x += 1;
          annotation.y += 1;
        }
        data.push(newChart);
        newAnnotations.push(annotation);
        i += 1;
      }
      console.log(rowCount);

    /*  update the d3Index, row, data object and layout object  */
    this.updateState(update(this.state, {
      data: {$set: data},
      layout: {title: {$set: this.getChartTitle(d2Index)}, grid: {rows: {$set: rowCount + 1}, columns: {$set: 3}}, annotations: {$set: newAnnotations}},
    }));
  }

  // Create new pie chart and set location
  newChart = (item, row, column, d3Arr) => {
    console.log(item);
    let newChart = {
      name: this.getD2Name(),
      hoverinfo: 'label+percent+name',
      hole: 0.6,
      textposition: 'inside',
      labels: [],
      type: 'pie',
      domain: {},
      sort: true
    };

    /*  if this is a 3d chart, make the labels the values from d3Index at each d2Index  */
    for (let i of item.dupIndices)
      newChart.labels.push(d3Arr[i].label);
    // Set the rows and columns
    newChart.domain.row = row;
    newChart.domain.column = column;
    newChart.name = item.label;

    return newChart;
  }

  /*  Create new annotation, set the text, its position, and style  */
  newAnnotation = (i, d2Index, d3Index) => {
    let annotation = {
      text: this.xxx[d2Index].items[i].label,
      xref: 'paper',
      x: 1,
      y: 0.5,
      font: { size: 20 },
      showarrow: false
    };
    if (d3Index !== -1) {
      if (i % 2 === 0)
        annotation.x = 0;
    }

    return annotation;
  }

updateState = (newState) => {
  this.setState(newState);
}

    getLength = (i) => {
      return this.xxx[i].items.length;
    }

    getChartTitle = (d2Index) => {
      return Object.keys(this.props.records)[d2Index];
    }

    /*  Returns a set with unique items  */
    getD2Set = (d2Index) => {
      let d2Set = [];
      let items = this.xxx[d2Index].items;
      // Iterate through each item
      for (let i = 0; i < items.length; i++) {
        let currItem = items[i];
        let indexOfLargest = i;
        // Check to see if there is an identical item with more duplicate indices
        for (let j = i; j < items.length; j++)
          if (items[j].label === currItem.label)
            if (items[j].dupIndices.length > currItem.dupIndices.length) {
              indexOfLargest = j;
            }
        if (items[indexOfLargest].viewed === false) {
          d2Set.push(items[indexOfLargest]);
          items[indexOfLargest].viewed = true;
        }
      }
      for (let item of items)
        item.viewed = false;
      return d2Set;
    }

    handleSetChange = (e) => {
      let index = e.target.selectedIndex;
      // Creating 3D Chart
      if (this.d2Index === -1) {
        this.d2Index = index;
        this.set2DChart(index);
      }
      else {
        this.d3Index = index;
        this.setD3Pie(index);
      }
    }

    render() {
      console.log(this.state);
      console.log(this.xxx);
      return (
        <div>
          <ChooseSet
            handleSetChange={this.handleSetChange}
            records={Object.keys(this.props.records)}
            index={this.state.d3Index}
          />
          <PieSlider
            value={this.state.viewNum}
            handleNumChange={this.updateViewNum}
            size={this.state.size}
          />
          <Plot
            data={this.state.data}
            layout={this.state.layout}
            useResizeHandler={this.state.useResizeHandler}
            style={this.state.style}
            />
        </div>
      )
    }
  }
