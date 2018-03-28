import React from 'react';
import ReactDOM from 'react-dom';
import socket from './socket';
import Board from './board';
import GameInfo from './game_info';
import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";


export default function renderGamePage(destination) {
    ReactDOM.render(<Game/>, destination);
};


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {squares: [], pieces: [], player_role: 0, turn: -100,
            player1open: true, player2open: true};
    }

    componentDidMount() {
        let channel = socket.channel("game:" + window.gameName,{watcher: window.watcher});

        $(window).on('beforeunload', function() {
            channel.push("player_left", {});
        });

        channel.join()
            .receive("ok", resp => {
                console.log("Joined game room" + window.gameName + "successfully", resp);
                this.notifyPlayerRole(resp.player_role);
                channel.push("player_joined", {});
                this.setState(resp);
            })
            .receive("error", resp => {
                console.log("Unable to join game room" + window.gameName, resp)
            });
        // handle update messages
        channel.on("game_update", payload => {
            console.log('game update', payload);
            this.setState({pieces: payload.pieces,
                turn: payload.turn, player1score: payload.player1score,
                player2score: payload.player2score, status: payload.status});
        });
        channel.on("player_update", payload => {
            console.log('player update', payload);
            this.setState(payload);
        });
        channel.on("game_reset", payload => {
            console.log('reseting game', payload);
            this.setState(payload);
        });
        channel.on("player_left", payload => {
            console.log('player left update', payload);
            if (this.state.player1open == false && payload.player1open == true) {
                M.toast({html: 'Player 1 has left the game!', classes: 'blue-text'});
            }
            if (this.state.player2open == false && payload.player2open == true) {
                M.toast({html: 'Player 2 has left the game!', classes: 'orange-text'});
            }
            this.setState(payload);

        });
        this.channel = channel;

    }

    notifyPlayerRole(role) {
        if (role == -1) {
            M.toast({html: 'Welcome player 1. You piece color is blue!', classes: 'blue-text'});
        } else if (role == 1) {
            M.toast({html: 'Welcome player 2. You piece color is orange!', classes: 'orange-text'});
        } else {
            M.toast({html: 'Welcome. Thanks for tuning in!'});
        }
    }

    leaveGame() {
        console.log('leaving game');
        this.channel.push("player_left", {});
        window.location.href= '/home';
    }

    resetGame() {
        console.log('reseting game');
        this.channel.push("game_reset", {});
    }

    makeMove(from, to) {
        this.channel.push("move_msg", {from: from, to: to});
    }


    render() {

        return (
            <div className="gamearea row">
                <div className="gamearea col s6">
                    <Board pieces={this.state.pieces} turn={this.state.turn}
                           player_role={this.state.player_role} status={this.state.status}
                           squares={this.state.squares} makeMove={(from, to) => this.makeMove(from, to)}/>
                </div>
                <div className="col offset-s1 s5">
                    <GameInfo name={window.gameName} watcher={window.watcher} parent_state = {this.state}
                              leaveGame={() => this.leaveGame()} resetGame={() => this.resetGame()}/>
                </div>
            </div>


        );
    }
}
