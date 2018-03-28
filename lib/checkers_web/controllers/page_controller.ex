defmodule CheckersWeb.PageController do
  use CheckersWeb, :controller

  alias CheckersWeb.GameChannel
  alias Checkers.CheckerBoard

  def index(conn, _params) do
    render conn, "index.html"
  end


  def home(conn, _params) do
    render conn, "home.html"
  end

  def watchgame(conn, params) do
    render conn, "checkers.html", gamename: params["gamename"], watcher: true
  end

  def joingame(conn, params) do
    game_name = params["gamename"]
    GameChannel.broadcast_game_list()
    CheckerBoard.create_game(game_name)
    render conn, "checkers.html", gamename: game_name, watcher: false
  end

  def rules(conn, _params) do
    render conn, "rules.html"
  end


end
