import React from 'react';
import Plot from 'react-plotly.js';
import PieSlider from './PieSlider';

export default class Pie extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        layout: {
          title: 'Sample Chart',
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
        row: 0,
        column: 0,
        charCount: 0,
        d2Index: 2,
        d3Index: 1
      },

      this.records = [];
      this.stats = [];
      this.dupStats = [];
    }

    componentDidMount() {
      console.log('Records:');
      this.getStats();
      console.log(this.records);
      this.initPie();  // Initializes plotly data array with the records and sets title in layout
      this.addChart(2)
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
            values: this.stats[this.state.d2Index].values.slice(0, this.state.viewNum),
            labels: this.stats[this.state.d2Index].labels.slice(0, this.state.viewNum),
            type: 'pie'
          }
        ],
        size: this.stats[0].count
      });
    }

    getDupIndices = (element, d2Index, d3Index) => {
      let indices = [];
      let index = this.stats[d2Index].labels.indexOf(element, 0);
      console.log(this.stats[d2Index].labels);
      console.log('Element');
      console.log(element);
      while (index !== -1) {
        indices.push(index);
        index = this.stats[d2Index].labels.indexOf(element, index + 1);

      }
      return indices;
    }

    addChart = (e) => {
      let row = this.state.row;
      let column = this.state.column;
      let data = [...this.state.data];
      let layout = {...this.state.layout};
      let d3Index = e;//= e.target.selectedIndex;

      for (let element of this.stats[this.state.d2Index].labels.slice(0, this.state.viewNum)) {
        let indices = this.getDupIndices(element, this.state.d2Index, d3Index);
        console.log(`Indices`);
        console.log(indices);
        let labels = [];
        let values = [];
        let error = false;

        for (let index of indices) {
          if (this.stats[d3Index].values[index] !== undefined && this.stats[d3Index].values[index] !== undefined) {

            console.log('Values:');
            console.log(this.stats[d3Index].values[index]);
            console.log('Labels:');
            console.log(this.stats[d3Index].labels[index]);

            values.push(this.stats[d3Index].values[index]);
            labels.push(this.stats[d3Index].labels[index]);
          }
          else {
            error = true;
          }
        }
        if (!error) {
          let newChart = {
            values: values,
            labels: labels,
            type: 'pie',
            domain: {}
          };

          let newAnnotation = [{
            text: element
          }];

          newChart.domain.row = row;
          newChart.domain.column = column;

          column += 1;

          if (column === 3) {
            column = 0;
            row += 1;
          }

          data.push(newChart);
          layout.annotations.push(newAnnotation);
          error = false;
        }
      }

      console.log('Data:');
      console.log(data);
      console.log('Layout');
      console.log(layout);
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
        let freq = [];
        let sum = 0;

        let dupStats = [
          {value: ' ', count: 0}
        ];

        for (let i of this.records) {
          dupStats[i].value = records[i];
          dupStats[i].count = records[dupStats[i]];
        }

        for (let key in records)
          count.push(records[key]); // store count of each item in array

        sum = count.reduce((a, b) => a + b, 0);

        count.forEach((val) => {
          freq.push(val / sum);
        });

        count = count.sort((a, b) => b - a);  // Sorts the count of each item from [High -> Low]
        freq = freq.sort((a, b) => b - a);  // Sorts the frequency of each item from [High -> Low]
        records = Object.keys(records).sort((a, b) => records[b] - records[a]);  // Sorts the records by the number of duplicates [High -> Low]

        let dictionary = {
          'count': Object.keys(records).length,
          'labels': records,
          'values': count,
          'frequency': freq
        };
        this.records[i] = records;
        this.stats[i] = dictionary;
        this.dupStats[i] = dupStats
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
