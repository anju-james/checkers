import React from 'react';
import ReactDOM from 'react-dom';
import CreateGame from "./create_game";
import GameList from "./game_list";


export default function renderHomePage(createRoot, listRoot) {
    ReactDOM.render(<CreateGame />, createRoot);
    ReactDOM.render(<GameList/>, listRoot);
}