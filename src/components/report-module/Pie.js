import React from 'react';
import Plot from 'react-plotly.js';
import PieSlider from './PieSlider';

export default class Pie extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        layout: {},
        viewNum: 10,
        abbrRecords: [],
        records: [],
        size: 0
      }
      this.data = this.props.records.title;
    }

    /*
     Graph {title} data set.
     In the future, only the specified
     dataset will be sent as a prop
     to the Pie component
     */

    componentDidMount() {
      this.abbr();
      this.PiePlot();
    }

    componentDidUpdate(prevProps, prevState) {
      if ((this.state.viewNum != prevState.viewNum) || (this.state.abbrRecords != prevState.records))
        this.PiePlot(this.props.records.title); // Graph {title} data set
    }

    abbr = () => {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].length > 15) {
          if (this.data[i].indexOf(' ', 15) !== -1)
            this.data[i] = this.data[i].slice(0, this.data[i].indexOf(' ', 15));
          this.data[i] = this.data[i].concat('...');
        }
      }
      this.setRecords();
    }

    setRecords = () => {
      this.setState({
        abbrRecords: this.data,
        records: this.data = this.props.records.title
      });
    }

    PiePlot = () => {
      // Returns dictionary with data statistics
      let SumStat = this.summaryCategorical();
      console.log(SumStat);
      let data = [
        {
          values: SumStat['Count'],
          labels: SumStat['Label'],
          type: 'pie'
        }
      ];
      let layout = {
        title: this.props.name,
        height: 1000,
        width: 1000,
        showlegend: true
      };
      let size = SumStat['Level'];
      this.handlePieUpdate(data, layout, size);
    }

    countDuplicates = (obj, key) => {
      obj[key] = (++obj[key] || 1);
      return obj;
    }

    //Summary function for categorical variable
    summaryCategorical = () => {
      let records = this.state.abbrRecords.reduce(this.countDuplicates, {});  // Stores the unique records
      let count = [];
      let freq = [];

      for (let key in records) {
        count.push(records[key]); // store count of each item in array
        freq.push(records[key] / Object.keys(records).length);  store frequency -> [count / Total Count] in array
      }

      count = count.sort((a, b) => b - a);  // Sorts the count of each item from [High -> Low]
      freq = count.sort((a, b) => b - a);  // Sorts the frequency of each item from [High -> Low]
      records = Object.keys(records).sort((a, b) => records[b] - records[a]);  // Sorts the records by the number of duplicates [High -> Low]

      let dictionary = {
        'Level': records.length, // stores the number of records
        'Label': records.slice(0,(this.state.viewNum)),
        'Count': count.slice(0,(this.state.viewNum)),
        'Frequency': freq.slice(0,(this.state.viewNum))
      };

      return dictionary;
    }

    handleNumChange = (e) => {
      this.setState({
        viewNum: e.target.value
      });
    }

    handlePieUpdate = (data, layout, size) => {
      this.setState({
        data: data,
        layout: layout,
        size: size
      });
    }

    render() {
      return (
        <div>
          <PieSlider
            value={this.state.viewNum}
            handleNumChange={this.handleNumChange}
            size={this.state.size}
          />
          <Plot data={this.state.data} layout={this.state.layout}/>
        </div>

      )
    }
  }
