import React from 'react';
import './fonts.css';
import GraphUI from './GraphUI';
import styles from './App.css';
import Plot from 'react-plotly.js';
import GetRecords from './GetRecords';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                x: ['Dog', 'Cat', 'Mouse'],
                y: [1, 2, 3],
                type: 'bar',
                opacity: 1
            }],
            layout: {
                height: 500,
                width: 1000,
                title: 'Sample Graph',
                xaxis: {
                    title: String
                },
                yaxis: {
                    title: String
                }
            },
            defaultHeight: 500,
            defaultWidth: 1000,
            graphTypes: ['Bar', 'Line', 'Pie'],
            okapiToken: String,
            records: [],
            userData: [
                {id: 5, username: 'John', enrollmentData: new Date(2018, 11)},
                {id: 8, username: 'John', enrollmentData: new Date(2017, 11)},
                {id: 6, username: 'Terry', enrollmentData: new Date(2018, 5)},
                {id: 9, username: 'Larry', enrollmentData: new Date(2018, 5)},
                {id: 7, username: 'Kate', enrollmentData: new Date(2017, 5)}
            ],
            propertyObjectArray: [],
            isLoaded: Boolean,
            dataSets: [
                {name: 'Circulation', url: 'http://localhost:9130/instance-storage/instances?limit=500&query=%28title%3D%22%2A%22%20or%20contributors%20adj%20%22%5C%22name%5C%22%3A%20%5C%22%2A%5C%22%22%20or%20identifiers%20adj%20%22%5C%22value%5C%22%3A%20%5C%22%2A%5C%22%22%29%20sortby%20title'},
                {name: 'Users', url: 'http://localhost:9130/users?limit=500&query=%28cql.allRecords%3D1%29%20sortby%20personal.lastName%20personal.firstName'}
            ],
            body: JSON.stringify({
                'username': 'diku_admin',
                'password': 'admin'
            }),
            headers: new Headers({
                'Content-type': 'application/json',
                'X-Okapi-Tenant': 'diku',
            }),
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onAxisChange = this.onAxisChange.bind(this);
        this.swapAxes = this.swapAxes.bind(this);
        this.updateOpacity = this.updateOpacity.bind(this);
        this.getRecords = this.getRecords.bind(this);
        this.createGraphData = this.createGraphData.bind(this);
        this.getCount = this.getCount.bind(this);
        this.changeGraphType = this.changeGraphType.bind(this);
        this.updateSize = this.updateSize.bind(this)
    }

    onAxisChange(e) {
        var axes = e;

        var temp = [{
            x: axes.x.values,
            y: axes.y.values,
            type: this.state.data[0].type,
            opacity: this.state.data[0].opacity
        }]
        this.updateAxesLabels(axes)
        this.setState({ data: temp })
    }

    updateAxesLabels(axes) {
        let newLayout = {
            height: this.state.layout.height,
            width: this.state.layout.width,
            title: this.state.layout.title,
            xaxis: {
                title: axes.x.type
            },
            yaxis: {
                title: axes.y.type
            }
        }

        this.setState({layout: newLayout})
    }

    changeGraphType(newType) {
        let newGraph = [{}];

        newType = newType.toLowerCase();

        if (newType === 'pie') {
             newGraph = [{
                labels: this.state.data[0].x,
                values: this.state.data[0].y,
                type: newType,
                opacity: this.state.data[0].opacity
            }]
        }
        else if (this.state.data[0].type === 'pie') {
             newGraph = [{
                x: this.state.data[0].labels,
                y: this.state.data[0].values,
                type: newType,
                opacity: this.state.data[0].opacity
            }]
        }
        else {
            newGraph = [{
                x: this.state.data[0].x,
                y: this.state.data[0].y,
                type: newType,
                opacity: this.state.data[0].opacity
            }]
        }


        this.setState({data: newGraph})
    }

    getCount(arr) {
        var lastElement = arr[0];
        var count = 1;
    
        var countArr = [];
    
        for (var x = 1; x <= arr.length; x++) {
            if (arr[x] === lastElement) {
                count++;
            }
            else {
                countArr.push(count);
                count = 1;
                lastElement = arr[x];
            }
        }
        return countArr;
      }

      removeDuplicates = (arr) => {
        var noDupes = [];
        noDupes.push(arr[0])
        var lastElement = arr[0];

        for (var x = 1; x < arr.length; x++) {
            if (arr[x] !== lastElement) {
                noDupes.push(arr[x]);
                lastElement = arr[x];
            }
        }
        return noDupes;
    }

    swapAxes() {
        var swap = [{
            x: this.state.data[0].y,
            y: this.state.data[0].x,
            type: this.state.data[0].type,
            opacity: this.state.data[0].opacity
        }]

        this.setState({ data: swap })
    }

    updateOpacity(e) {
        var newOpacity = e.target.value;

        newOpacity /= 100;

        var temp = [{
            x: this.state.data[0].x,
            y: this.state.data[0].y,
            type: this.state.data[0].type,
            opacity: newOpacity
        }]

        this.setState({ data: temp })
    }

    updateSize(e) {
        let sizeMultiplier = e.target.value;

        let newHeight = this.state.defaultHeight;
        let newWidth = this.state.defaultWidth;

        newHeight *= (sizeMultiplier / 100);
        newWidth *= (sizeMultiplier / 100);

        let newLayout = this.state.layout;
        newLayout.height = newHeight;
        newLayout.width = newWidth;

        //let newLayout = {
        //    height: newHeight,
        //    width: newWidth,
        //    title: this.state.layout.title,
        //    xaxis: this.state.layout.xaxis,
        //    yaxis: this.state.layout.yaxis
        //}
        
        this.setState({layout: newLayout});
    }

    getRecords(dataArr) {
        var title = {
            x: {
                values: this.removeDuplicates(dataArr.title)
            },
            y: {
                values: this.getCount(dataArr.title)
            }
        }
        this.onAxisChange(title)
    }

    createGraphData(arr) {
        let propertyArray = Object.getOwnPropertyNames(arr[0]);

        propertyArray.forEach(element => {
            var propertyObject = {
                type: element,
                data: [ ]
            };
            arr.forEach(element => {
                var temp = Object.getOwnPropertyDescriptor(element, propertyObject.type)

                propertyObject.data.push(temp.value)
            });
            this.state.propertyObjectArray.push(propertyObject);
        });
    }

    componentDidMount() {
        this.createGraphData(this.state.userData);

        fetch('http://localhost:9130/authn/login', {
          method: 'POST',
          body: JSON.stringify({
            'username': 'diku_admin',
            'password': 'admin'
          }),
          headers: new Headers({
            'Content-type': 'application/json',
            'X-Okapi-Tenant': 'diku',
          })
        })
        .then((res) => {
          this.setState({
            okapiToken: res.headers.get('x-okapi-token'),
            isLoaded: true
          });
        });
      }

    render() {
        return (
            <div className={styles.componentFlexRow}>
                <GraphUI 
                    changeAxis={this.onAxisChange}
                    graphData={this.state.data[0]}
                    axisData={this.state.propertyObjectArray}
                    swapAxes={this.swapAxes}
                    updateOpac={this.updateOpacity}
                    updateSize={this.updateSize}
                    opacity={this.state.opacity}
                    changeType={this.changeGraphType}
                    values={this.state.graphTypes}
                />
                <Plot data={this.state.data} layout={this.state.layout}/>
                <GetRecords
                    getRecords={this.getRecords}
                    url={this.state.dataSets[0].url}
                    token={this.state.okapiToken}
                />
            </div>
        );
    }
}
    