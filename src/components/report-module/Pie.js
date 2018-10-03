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
        abbrRecords: this.abbr(this.props.records.title),
        size: 0
      }
    }

    componentDidMount() {
      //  window.addEventListener('resize', this.handleResize);
      let SumStat = this.summaryCategorical();  // Get record's stats
      this.cookPie(SumStat);  // Initializes plotly data array with the records and sets title in layout
    }

    cookPie = (SumStat) => {
      this.setState({
        data: [
          {
            values: SumStat.Count,
            labels: SumStat.Label,
            type: 'pie'
          }
        ],

        size: SumStat.Level
      });
    }

    //  Returns an object with the total number of records, unique labels, and each label's frequency
    summaryCategorical = () => {
      let records = this.state.abbrRecords.reduce(this.countDuplicates, {});  // Stores the unique records
      let count = [];

      for (let key in records)
        count.push(records[key]); // store count of each item in array

      count = count.sort((a, b) => b - a);  // Sorts the count of each item from [High -> Low]
      records = Object.keys(records).sort((a, b) => records[b] - records[a]);  // Sorts the records by the number of duplicates [High -> Low]

      let dictionary = {
        'Level': Object.keys(records).length,
        'Label': records.slice(0,(this.state.viewNum)),
        'Count': count.slice(0,(this.state.viewNum)),
      };
      return dictionary;
    }

    // Change the number of slices in PIE chart
    updateViewNum = (e) => {
      this.setState({viewNum: e.target.value}, () => {
        let SumStat = this.summaryCategorical();
        let data = [
          {
            values: SumStat.Count,
            labels: SumStat.Label,
            type: 'pie'
        }
      ]
        this.updatePie(data);
      });
    }

    updatePie = (data) => {
      this.setState({
        data: data
      });
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

    handleResize = (e) => {
      //  window.innerWidth
      //  window.innerHeight
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
