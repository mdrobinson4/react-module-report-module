import React from 'react';
import Plot from 'react-plotly.js';
import PieSlider from './PieSlider';

/*
  JARGON -> (1) d2Index --- first set of data (array of values) selected (2) d3Index --- Second set of data (array of values) selected
  For every element in the array at d2Index, Find another element in the array at d3Index.
  Each chart represents each (unique) item in the array at d2Index.
*/

export default class Pie extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [
        ],
        layout: {
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
        row: 0,
        column: 0,
        charCount: 0,
        d2Index: 2,
        d3Index: 1,
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
      this.addChart(1);
    }

    componentWillUnmount() {
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


    addChart = (e) => {
      let data = [...this.state.data];

      let layout = {
        grid: this.state.layout.grid,
        title: '',
        annotations: [],
        autosize: this.state.layout.autosize
    };

      layout.title = (Object.keys(this.props.records)[this.state.d2Index]).toUpperCase();

      let d3Index = e;//= e.target.selectedIndex;

      let row = this.state.row;
      let column = this.state.column

      let i = 0;
      let d2Length = this.stats[this.state.d2Index].labels.length;
      let d3Length = this.stats[d3Index].labels.length;

      // Iterate through item in the array at d2Index
      while ( (i < d2Length) && (i < d3Length)) {
        let indices = this.getDupIndices(this.stats[this.state.d2Index].labels[i], this.state.d2Index); // Get the indices where this element exists

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

         // Add a new title and style it
        let newAnnotation = {
          text: this.stats[this.state.d2Index].labels[i],
          x: 0.228,
          y: 1,
          font: { size: 20 },
          showarrow: false
        };

        // Set the rows and columns
        newChart.domain.row = row;
        newChart.domain.column = column;
        newChart.name = this.stats[this.state.d2Index].labels[i];

        column += 1;

        // If the last item in a row was just added, go to a lower row and start at the first column
        if (column === 3) {
          column = 0;
          row += 1;
          layout.grid.rows += 1;
          newAnnotation.x += 1;
          newAnnotation.y += 1;
        }

        // Add the new chart and annotations to the data and layout variables (respectively)
        data.push(newChart);
        layout.annotations.push(newAnnotation);
        i += 1;
      }
    // Update the state to include the new charts, annotations, row, column, chart count, and d3Index
    this.updateState(data, layout, row, column, this.state.chartCount + 1, d3Index);
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

    updateState = (data, layout, row, column, charCount, d3Index) => {
      this.data = data;
      this.setState({
        data: data,
        layout: layout,
        row: row,
        column: column,
        charCount: charCount,
        d3Index: d3Index
      });
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

          let uniqueStats = this.getCount(records);

          this.dupStats.push(dupStats);
          this.stats.push(uniqueStats);
          this.records.push(records);
        }
    }



    getCount = (records) => {
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
