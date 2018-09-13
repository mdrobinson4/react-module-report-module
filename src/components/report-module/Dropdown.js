import React from 'react';

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownData: {
                graphType: ['bar', 'line', 'pie'],
                dataType: [], //column names from data goes here
                
            }
        }
    }
}