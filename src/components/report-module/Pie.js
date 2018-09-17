import React from 'react';
import Plot from 'react-plotly.js';

export default class pie extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        layout: {}
      }
    }

    componentDidMount() {
      console.log(this.props.records);
      this.PiePlot(this.props.records);
    }

    componentDidUpdate() {
      this.PiePlot(this.props.records);
    }

    PiePlot = () => {
      let viewNum = 100;
      let sumStat = this.summaryCategorical(data, viewNum);
      let data = [
        {
          values: SumStat['LabelCount'],
          labels: SumStat['UniqueLabel'],
          type: 'pie'
        }
      ];
      this.handlePieUpdate(data);
    }

    //Summary function for categorical variable
    summaryCategorical = (data) => {
      let data1 = data;
      let answer = data1.reduce(this.countDuplicates, {});

      let sortKey = Object.keys(answer).sort((a, b) => {
          return answer[b] - answer[a];
      });

      let sortCount = [];
      let sortFrequency = [];

      for (let i = 0; i < Object.keys(answer).length; i++) {
        sortCount.push(answer[sortKey[i]]);
        sortFrequency.push(answer[sortKey[i]]/(Object.keys(answer).length));
      };

      let dictBelow7 = {
        'Level': this.countUnique(variable),
        'UniqueLabel': sortKey,
        'LabelCount':sortCount,
        'LabelFrequency':sortFrequency
      };

      let dictAbove7 = {
        'Level': this.countUnique(variable),
        'UniqueLabel': sortKey,
        'TopLabel':sortKey.slice(0,(viewNum-1)),
        'TopCount':sortCount.slice(0,(viewNum-1)),
        'TopFrequency':sortFrequency.slice(0,(viewNum-1)),
        'BottomLabel':sortKey.slice( Object.keys(answer).length-viewNum-1,-1),
        'BottomCount':sortCount.slice( Object.keys(answer).length-viewNum-1,-1),
        'BottomFrequency':sortFrequency.slice( Object.keys(answer).length-viewNum-1,-1)
      };

      if (Object.keys(answer).length > 7)
        dict = dictAbove7;
      else
        dict = dictBelow7;

      return dict;
    }

    countDuplicates = (obj, num) => {
        obj[num] = (++obj[num] || 1);
        return obj;
    }

    countUnique = (iterable) => {
      return new Set(iterable).size;
    }

    handlePieUpdate = (data) => {
      this.setState({
        data: data,
        layout: layout
      });
    }

    render() {
      return (
        <Plot data={this.state.data} layout={this.state.layout} />
      )
    }
  }
