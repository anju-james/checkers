import React from 'react';
import ReactDOM from 'react-dom';


class GameDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exit: false,
            playerOneMoves: 0,
            playerTwoMoves: 0,
            PiecesLeftP1: 12,
            PiecesLeftP2: 12,
            watchers: []
        }
    }

    render() {
            return(
                <div className="row">
                    <a href="/home" class="waves-effect waves-light orange btn"><i class="material-icons left">fullscreen_exit</i>Exit</a>


                </div>
            );
        }
    }

