import React from 'react';
import PlotData from './PlotData'
import GraphUI from './GraphUI'
import styles from './style.css'

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
            },
            okapiToken: String,
            xAxisToggle: false,
            yAxisToggle: false,
            xAxisValues: [],
            yAxisValues: [],
            userData: [
                {id: 5, username: 'John', enrollmentData: new Date(2018, 11)},
                {id: 6, username: 'Terry', enrollmentData: new Date(2018, 5)},
                {id: 7, username: 'Kate', enrollmentData: new Date(2017, 5)}
            ],
            dataToPropertyMap: new Map()
        },

        this.handlePropertyArray = this.handlePropertyArray.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    handlePropertyArray(properties) {
        this.setState({ propertyArray: properties })
    }

    componentDidMount() {
        let propertyArray = Object.getOwnPropertyNames(this.state.userData[0])
        this.handlePropertyArray(propertyArray);

        for (var property in this.state.userData[0]) {
            this.dataToPropertyMap.set()
        }

    }
    render() {
        return (
            <div className={styles.componentFlex}>
                <GraphUI></GraphUI>
                <PlotData graph={this.state.graphData}/>
            </div>
        );
    }
}