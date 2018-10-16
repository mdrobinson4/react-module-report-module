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
        d3Index: 0,
        chartCount: 0
      },
      this.data = [];
      this.records = [];
      this.stats = [];
      this.dupStats = [];
    }

    componentDidMount() {
      this.getStats();
      //this.initPie();  // Initializes plotly data array with the records and sets title in layout
      this.addChart(3);
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
        size: this.stats[this.state.d2Index].count
      });
    }

    /*  return the indices where "element" exists */
    getDupIndices = (element, d2Index) => {
      let indices = [];
      let index = this.dupStats[d2Index].labels.indexOf(element, 0);  // Get first index

      // Continue adding the indices where "element" exists until -1 is returned -> "element" DNE in sub-array
      while (index !== -1) {
        indices.push(index);  // add index to indices array
        index = this.dupStats[d2Index].labels.indexOf(element, index + 1);
      }
      return indices;
    }

    getD2Length = () => {
      return this.stats[this.state.d2Index].labels.length;
    }

    getD3Length = (i) => {
      return this.stats[i].labels.length;
    }

    getChartTitle = () => {
      return (Object.keys(this.props.records)[this.state.d2Index]).toUpperCase();
    }

    // Create new pie chart and set location
    createChart = (indices, i, row, column, d3Index) => {
      let newChart = {
        hole: 0.6,
        textposition: 'inside',
        values: [],
        labels: [],
        type: 'pie',
        domain: {}
      };

      // Add the values and labels of the items in the same indices as the previously mentiond elemnt to a new chart which will be stored in data
      for (let index of indices) {
        newChart.values.push(this.stats[d3Index].values[index]);
        newChart.labels.push(this.stats[d3Index].labels[index]);
      }

      // Set the rows and columns
      newChart.domain.row = row;
      newChart.domain.column = column;
      newChart.name = this.stats[this.state.d2Index].labels[i];

      return newChart;
    }

    /*  Create new annotation, set the text, its position, and style  */
    createAnnotation = (i) => {
      let annotation = {
        text: this.stats[this.state.d2Index].labels[i],
        xref: 'paper',
        x: 1,
        y: 0.5,
        font: { size: 20 },
        showarrow: false
      };

      if (i % 2 === 0)
        annotation.x = 0;

      return annotation;
    }

    /*  Add new pie chart to group  */
    addChart = (e) => {
      let row = 0;
      let column = 0;
      let rowCount = 0;

      let d3Index = e;//= e.target.selectedIndex;

      let i = 0;
      let data = [];
      let newAnnotations = [];

      // Iterate through item in the array at d2Index
      while ( (i < this.getD2Length()) && (i < this.getD3Length(d3Index)) ) {
        let indices = this.getDupIndices(this.stats[this.state.d2Index].labels[i], this.state.d2Index); // Get the indices where this element exists

        let newChart = this.createChart(indices, i, row, column, d3Index);
        column += 1;

        let annotation = this.createAnnotation(i);

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

      /*  update the d3Index, row, data object and layout object  */
      this.updateState(update(this.state, {
        d3Index: {$set: d3Index},
        data: {$push: data},
        layout: {title: {$set: this.getChartTitle()}, grid: {rows: {$set: rowCount}}, annotations: {$set: newAnnotations}},
      }));
  }

    // Change the number of slices in PIE chart or the number of charts appear (if 3D Pie is selected)
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

    updateState = (newState) => {
      this.setState(newState);
    }

    //  Returns an object with the total number of records, unique labels, and each label's frequency
    getStats = () => {
      for (let key in this.props.records)
        this.records.push(this.abbr(this.props.records[key]));

        for (let i in this.records) {
          let records = this.records[i].reduce(this.countDuplicates, {});  // Stores the unique records

          let dupStats = {
            labels: [],
            values: []
          };
          let j = 0;
          for (let key of this.records[i]) {
            dupStats.labels.push(key);
            dupStats.values.push(records[key]);
            j += 1;
          }

          let uniqueStats = this.statHelp(records);

          this.dupStats.push(dupStats);
          this.stats.push(uniqueStats);
          this.records.push(records);
        }
    }

    statHelp = (records) => {
      let count = [];
      let sum = 0;
      let freq = [];

      for (let key in records)
        count.push(records[key]);

        sum = count.reduce((a, b) => a + b, 0);

        count.forEach((value) => {
          freq.push(value / sum);
        });

      count.reduce((a, b) => a + b, 0);

      count.forEach((value) => {
        freq.push(value / sum);
      });

      let stats = {
        'count': Object.keys(records).length,
        'labels': Object.keys(records),
        'values': count,
        'frequency': freq
      };
      return stats;
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

    handleSetChange = (e) => {
      index = e.target.selectedIndex;
      addChart(index);
    }

    render() {
      console.log(this.records);
      return (
        <div>
          <ChooseSet
            handleSetChange={this.handleSetChange}
            records={this.records}
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
