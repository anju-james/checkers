import React from 'react';
import ReactDom from 'react-dom';

class Square extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const fill = this.props.color == 1 ? "white" : "black";
        const letterColors = this.props.piececolor == 1 ? "#ff9800" : "#29b6f6";
        return (

            <div className="square" style={{
                backgroundColor: fill,
                color: letterColors
            }}>
                {this.props.children}
            </div>

        );
    }
}

export default Square;