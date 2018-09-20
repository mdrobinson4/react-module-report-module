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
          this.data[i] = this.data[i].slice(0, this.data[i].indexOf(' ', 15));
          this.data[i] = this.data[i].concat('...');
        }
      }
      this.setData();
    }

    setData = () => {
      this.setState({
        abbrRecords: this.data,
        records: this.data = this.props.records.title
      });
    }

    PiePlot = () => {
      // Returns dictionary with data statistics
      let SumStat = this.summaryCategorical();
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
      let uniqueRec = this.state.abbrRecords.reduce(this.countDuplicates, {});  // Removes and keeps track of num of dups
      let sortedRec = Object.keys(uniqueRec).sort((a, b) => uniqueRec[b] - uniqueRec[a]);  // Sorts the records by the number of duplicates [High -> Low]
      let sortedCount = [];
      let sortedFreq = [];


      for (let i = 0; i < Object.keys(uniqueRec).length; i++) {
        sortedCount.push(uniqueRec[sortedRec[i]]); // stores the number of dups present for each record
        sortedFreq.push(uniqueRec[sortedRec[i]] / (Object.keys(uniqueRec).length));  // stores the frequency of each record
      };

      let dictionary = {
        'Level': Object.keys(uniqueRec).length,
        'UniqueLabel': sortedRec,
        'Label': Object.keys(uniqueRec).slice(0,(this.state.viewNum - 1)),
        'Count': sortedCount.slice(0,(this.state.viewNum - 1)),
        'Frequency': sortedFreq.slice(0,(this.state.viewNum - 1))
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
            onValueChange={this.handleNumChange}
            size={this.state.size}
          />
          <Plot data={this.state.data} layout={this.state.layout}/>
        </div>

      )
    }
  }
