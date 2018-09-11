import React from 'react';
import PlotData from './PlotData'
import GraphUI from './GraphUI'

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            graphData: {
                data: [{
                    x: ['Dog', 'Cat'],
                    y: [1, 2],
                    type: 'bar'
                }],
                layout: {
                    height: 500,
                    width: 1000,
                    title: 'Sample Graph'
                }
            }
        }
    }
    render() {
        return (
            <div>
                
                <PlotData data={this.state}></PlotData>
            </div>
        );
    }
}