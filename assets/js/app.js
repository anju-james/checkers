// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket";
import renderGamePage from "./game";
import renderHomePage from './home_page';

function init() {
    let home_create = document.getElementById('home_create');
    let home_list = document.getElementById('home_list');
    if(home_create && home_list) {
        renderHomePage(home_create, home_list);
    }
    let game_page = document.getElementById("gamepage");
    if(game_page) {
        renderGamePage(game_page);
    }
}

// Use jQuery to delay until page loaded.
$(init);



