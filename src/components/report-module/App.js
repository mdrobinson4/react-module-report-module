import React from 'react';
import GraphUI from './GraphUI';
import styles from './style.css';
import RenderGraph from './RenderGraph';
import Plot from 'react-plotly.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                x: ['Dog', 'Cat', 'Mouse'],
                y: [1, 2, 3],
                type: 'bar'
            }],
            layout: {
                height: 500,
                width: 1000,
                title: 'Sample Graph'
            },
            okapiToken: String,
            xAxisToggle: false,
            yAxisToggle: false,
            xAxisValues: [],
            yAxisValues: [],
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
            getRecords: (result) => {
                this.setState({
                  records: result,
                  isloaded: true
                });
              }
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onAxisChange = this.onAxisChange.bind(this);
        this.swapAxes = this.swapAxes.bind(this);
    }

    onAxisChange(e) {
        var axes = e;

        var temp = [{
            x: axes.x.values,
            y: axes.y.values,
            type: this.state.data[0].type
        }]

        this.setState({ data: temp })
    }

    swapAxes() {
        var stateHolder = this.state.data;

        var swap = {
            x: this.state.data[0].y,
            y: this.state.data[0].x,
            type: this.state.data[0].type
        }

        stateHolder[0] = swap;

        this.setState({ data: stateHolder })
    }

    componentDidMount() {
        let propertyArray = Object.getOwnPropertyNames(this.state.userData[0]);

        propertyArray.forEach(element => {
            var propertyObject = {
                type: element,
                data: [ ]
            };
            this.state.userData.forEach(element => {
                var temp = Object.getOwnPropertyDescriptor(element, propertyObject.type)

                propertyObject.data.push(temp.value)
            });
            this.state.propertyObjectArray.push(propertyObject);
        });

        fetch('http://localhost:9130/authn/login', {
          method: 'POST',
          body: this.state.body,
          headers: this.state.headers
        })
        .then((res) => {
          this.setState({
            okapiToken: res.headers.get('x-okapi-token'),
            isLoaded: true
          });
        });
      }
      changeData = (e) => {
        this.setState({
          dataset: {
            value: e.target.value,
            name: e.target.label
          }
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
                />
                <Plot data={this.state.data} layout={this.state.layout}></Plot>
            </div>
        );
    }
}
    