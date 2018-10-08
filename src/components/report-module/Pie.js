import React from 'react';
import Plot from 'react-plotly.js';
import PieSlider from './PieSlider';

export default class Pie extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        layout: {
          title: this.props.title,
          autosize: true
        },
        style: {
          width: '100%',
          height: '100%'
        },
        useResizeHandler: true,
        viewNum: 10,
        records: [],
        size: 0,
        row: 0,
        column: 0,
        charCount: 0,
        d2Index: 0,
        d3Index: 0
      },

      this.records = [];
      this.stats = [];
    }

    componentDidMount() {
      this.getStats();
      this.initPie();  // Initializes plotly data array with the records and sets title in layout
      console.log(this.stats);
    }

    getStats = () => {
      for (let key in this.props.records)
        this.records.push(this.abbr(this.props.records[key]));
      this.summaryCategorical();  // Get record's stats
    }

    initPie = () => {
      this.setState({
        data: [
          {
            values: this.stats[0].values.slice(0, this.state.viewNum),
            labels: this.stats[0].labels.slice(0, this.state.viewNum),
            type: 'pie'
          }
        ],
        size: this.stats[0].count
      });
    }

    addChart = (e) => {
      let row = this.state.row;
      let column = this.state.column;
      let data = [...this.state.data];
      let layout = {...this.state.layout};

      let d3Index = e.target.selectedIndex;

      for (let i = 0; i < this.stats[this.state.d2Index].count; i++) {
        let newChart = {
          values: this.stats[d3Index].values[i],
          labels: this.stats[d3Index].labels[i],
          domain: {}
        };

        let newAnnotation = [{
            text: stats[d3Index].label[i]
          }];

        newChart.domain.row = row;
        newChart.domain.column = column;

        column += 1;

        if (column === 3) {
          column = 0;
          row += 1;
        }

        data.push(newChart);
        layout.push(newAnnotation);
      }
      this.updateState(data, layout, row, column, this.state.chartCount + 1, d3Index);
    }

    // Change the number of slices in PIE chart
    updateViewNum = (e) => {
      this.setState({
        viewNum: e.target.value
      }, () => {
        let data = [...this.state.data];
        data.forEach((set) => {
          set.values = this.stats[this.state.d3Index].values.slice(0, this.state.viewNum);
          set.labels = this.stats[this.state.d3Index].labels.slice(0, this.state.viewNum);
        });
        this.updateState(data);
      });
    }

    updateState = (data, ...lrcc) => {
      this.setState((prevState) =>({
        data: data,
        layout: lrcc[0] || prevState.layout,
        row: lrcc[1] || prevState.row,
        column: lrcc[2] || prevState.column,
        charCount: lrcc[3] || prevState.charCount,
        d3Index: lrcc[4] || prevState.d3Index
      }));
    }

    //  Returns an object with the total number of records, unique labels, and each label's frequency
    summaryCategorical = () => {
      for (let i in this.records) {
        let records = this.records[i].reduce(this.countDuplicates, {});  // Stores the unique records
        let count = [];

        for (let key in records)
          count.push(records[key]); // store count of each item in array

        count = count.sort((a, b) => b - a);  // Sorts the count of each item from [High -> Low]
        records = Object.keys(records).sort((a, b) => records[b] - records[a]);  // Sorts the records by the number of duplicates [High -> Low]

        let dictionary = {
          'count': Object.keys(records).length,
          'labels': records,
          'values': count,
        };

        this.records[i] = records;
        this.stats[i] = dictionary;
      }
    }

    // Abbreviate records. 99.999 % sure this will not be needed in the future. It's just here to prevent text from blocking pie chart
    abbr = (records) => {
      let data = records;
      for (let i = 0; i < data.length; i++) {
        if (data[i].length > 15) {
          if (data[i].indexOf(' ', 15) !== -1)
            data[i] = data[i].slice(0, data[i].indexOf(' ', 15));
          data[i] = data[i].concat('...');
        }
      }
      return data;
    }

    countDuplicates = (obj, key) => {
      obj[key] = (++obj[key] || 1);
      return obj;
    }

    handleSelect = (e) => {
      if (this.state.chartCount) {
        this.addChart(e);
        return;
      }
      this.initPie();
    }

    render() {
      return (
        <div>
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
