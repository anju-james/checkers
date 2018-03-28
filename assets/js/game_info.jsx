import React from 'react';


class GameInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    renderPlayer1Details() {
        if (this.props.parent_state.player1open == false) {
            return (<li className="collection-item avatar">
                <i className="circle blue" style={{fontStyle: "normal"}}>{this.props.parent_state.player1score}</i>
                <span className="title">Player 1</span>
                <p>{this.props.parent_state.player_role == -1 ? "This is you" : (window.watcher == false) ? "Opponent" : ""}
                    <br></br></p>
                {this.props.parent_state.turn == -1 && this.props.parent_state.player_role == -1 ?
                    <p style={{color: "white"}} className="task-cat blue">your turn</p> : (this.props.parent_state.turn == -1) ?
                        <p style={{color: "white"}} className="task-cat blue">blue's turn</p> : ""}
                {this.props.parent_state.player_role == -1 ? <a onClick={() => this.leaveGame()}><i className="secondary-content material-icons">exit_to_app</i></a> : null}
            </li>);
        } else {
            return (<li className="collection-item avatar">
                <i className="circle blue">{this.props.parent_state.player1score}</i><span className="title">Player 1</span>
                <p>Awaiting players to join</p><br></br>
                <i className="secondary-content"></i>
            </li>)

        }
    }

    leaveGame() {
        let leave = confirm("Are you sure you want to leave the game?");
        if (leave) {
            this.props.leaveGame();

        }
    }

    resetGame() {
        let reset = confirm("Are you sure you want to reset the game?");
        if (reset) {
            this.props.resetGame();

        }
    }

    renderPlayer2Details() {
        if (this.props.parent_state.player2open == false) {
            return (<li className="collection-item avatar">
                <i className="circle orange" style={{fontStyle: "normal"}}>{this.props.parent_state.player2score}</i>
                <span className="title">Player 2</span>
                <p>{this.props.parent_state.player_role == 1 ? "This is you" : (window.watcher == false) ? "Opponent" : ""} </p>
                <br></br>
                {this.props.parent_state.turn == 1 && this.props.parent_state.player_role == 1 ?
                    <p style={{color: "white"}} className="task-cat orange">your turn</p> : (this.props.parent_state.turn == 1) ?
                        <p style={{color: "white"}} className="task-cat orange">orange's turn</p> : ""}
                {this.props.parent_state.player_role == 1 ? <a onClick={() => this.leaveGame()}><i className="secondary-content material-icons">exit_to_app</i></a> : null}
            </li>);
        } else {
            return (<li className="collection-item avatar">
                <i className="circle orange">{this.props.parent_state.player2score}</i><span className="title">Player 2</span>
                <p>Awaiting players to join</p><br></br>
                <i className="secondary-content"></i>
            </li>);
        }

    }

    watcherDetails() {
        if (this.props.parent_state.player_role == 0) {
            return (<li className="collection-item avatar">
                <i className="material-icons circle">local_play</i>
                <span className="title">Watcher</span>
                <p>You</p><br></br><p></p>
                <a onClick={() => this.leaveGame()}><i className="secondary-content material-icons">exit_to_app</i></a>
            </li>);
        }
    }

    render() {
        let status = (this.props.parent_state.status == -1 ? "Game Over - " : 'Ongoing game - ')
        let reset =  (this.props.parent_state.player_role != 0) ? <div className="row"><a className="btn" onClick={() => this.resetGame()}>Reset Game</a></div> : ""
        return (<div><div className="row"><ul className="collection with-header">
            <li className="collection-header">
                <h5>{status + this.props.name}</h5>
            </li>
            {this.renderPlayer1Details()}
            {this.renderPlayer2Details()}
            {this.watcherDetails()}

        </ul>
        </div>
            {reset}
        </div>);
    }
}

export default GameInfo;