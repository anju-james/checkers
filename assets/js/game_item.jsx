import React from 'react';
import ReactDOM from 'react-dom';
import Blockies from 'react-blockies';

class GameItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let playButton = null;
        if(this.props.isOpen){
            let gamepath = "/game/join/" + this.props.name;
            playButton = <a href={gamepath} className="waves-effect waves-teal secondary-content">
                <i className="material-icons">videogame_asset</i></a>
        }
        let watchpath= "/game/watch/" + this.props.name;
        return (
            <tr>
            <td><Blockies seed={this.props.name} scale={5} className="circle"/></td>
            <td><h5>{this.props.name}</h5></td>
            <td><a href={watchpath} className="waves-effect waves-teal secondary-content"><i className="material-icons">remove_red_eye</i></a></td>
            <td>{playButton}</td>
        </tr>);
    }
}

export default GameItem;
