import React from 'react';
import Plot from 'react-plotly.js';
import PiSlider from './PieSlider';

export default class pie extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        layout: {},
        viewNum: 10,
        records
      }
    }

    componentDidMount() {
      this.handleMount();
      this.PiePlot(this.props.records);
    }


    componentDidUpdate() {
      if (this.props.records != this.state.records) {
        console.log(JSON.stringify(this.props.records));
        this.PiePlot(this.props.records);
      }
    }

    handleNumChange = (e) => {
      this.setState({
        viewNum: e.target.value
      });
    }

    countDuplicates = (obj, num) => {
      obj[num] = (++obj[num] || 1);
      return obj;
    }

    handleMount = () => {
      this.setState({
        records: this.props.records
      });
    }

    handlePieUpdate = (data, layout) => {
      this.setState({
        data: data,
        layout: layout,
      });
    }

    PiePlot = (records) => {
      // Returns dictionary with data statistics
      let SumStat = this.summaryCategorical(records);
      console.log(SumStat);
      let data = [
        {
          values: SumStat['TopFrequency'],
          labels: SumStat['UniqueLabel'],
          type: 'pie'
        }
      ];
      let layout = {
        height: 1000,
        width: 1000,
        showlegend: false
      };
      this.handlePieUpdate(data, layout);
    }

    //Summary function for categorical variable
    summaryCategorical = (records) => {
      let answer = '';
      console.log(records);

      // Removes and keeps track of num of dups
      answer = records.title.reduce(this.countDuplicates, {});

      console.log(answer);

      // Sorts by the number of duplicates [Low -> High]
      let sortKey = Object.keys(answer).sort((a, b) => answer[b] - answer[a]);

      console.log(sortKey);

      let sortCount = [];
      let sortFrequency = [];

      for (let i = 0; i < Object.keys(answer).length; i++) {
        sortCount.push(answer[sortKey[i]]);
        sortFrequency.push(answer[sortKey[i]] / (Object.keys(answer).length));
      };

      let dictBelow7 = {
        'Level': this.countUnique(records.title),
        'UniqueLabel': sortKey,
        'LabelCount':sortCount,
        'LabelFrequency':sortFrequency
      };

      let dictAbove7 = {
        'Level': this.countUnique(records.title),
        'UniqueLabel': sortKey,
        'TopLabel':sortKey.slice(0,(this.state.viewNum - 1)),
        'TopCount':sortCount.slice(0,(this.state.viewNum - 1)),
        'TopFrequency':sortFrequency.slice(0,(this.state.viewNum - 1)),


        'BottomLabel':sortKey.slice( Object.keys(answer).length - this.state.viewNum - 1, - 1),
        'BottomCount':sortCount.slice( Object.keys(answer).length-this.state.viewNum - 1, - 1),
        'BottomFrequency':sortFrequency.slice( Object.keys(answer).length-this.state.viewNum - 1, - 1)
      };

      if (Object.keys(answer).length > 7)
        return dictAbove7;

      return dictBelow7;
    }


    countUnique = (iterable) => {
      return new Set(iterable).size;
    }

    render() {
      return (
        <PieSlider onChange={() => this.handleNumChange}
        <Plot data={this.state.data} layout={this.state.layout}/>
      )
    }
  }
