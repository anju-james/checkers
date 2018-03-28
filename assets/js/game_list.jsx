import React from 'react';
import GameItem from './game_item';
import socket from './socket';

class GameList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {game_list: []}

    }

    componentDidMount() {
        let channel = socket.channel("lobby", {});
        channel.join()
            .receive("ok", resp => {
                this.setState(resp);
            })
            .receive("error", resp => {console.log("Unable to join", resp)});

        channel.on("game_start", payload => {
            console.log("Player update in gamelist", payload);
            this.setState(payload);
        })
    }

    render() {

        return (<div className="row">
            <div className="col s12 m4 l4">
                <h4 className="orange-text">Ongoing Games</h4>
            </div>
            <div className="col s12 m8 l8">
                <table className="striped">
                    <tbody>{this.renderGameList()}</tbody>
                </table>
            </div>
        </div>);
    }


    renderGameList() {
        let newlist = this.state.game_list.map((game, i) => {
                return <GameItem key={i} name={game.name} isOpen={game.player1open || game.player2open}/>
            }
        );

        return newlist;
    }

}

export default GameList;