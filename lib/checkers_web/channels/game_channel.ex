defmodule CheckersWeb.GameChannel do
  use Phoenix.Channel

  alias Checkers.CheckerBoard

  def join("lobby", _message, socket) do
    {:ok, %{"game_list" => CheckerBoard.get_all_games()}, socket}
  end

  def join("game:" <> game_name, %{"watcher" => watcher}, socket) do
    socket = assign(socket, :game_name, game_name)
             |> assign(:player_role, CheckerBoard.get_next_available_playerslot(game_name, watcher))

    IO.inspect watcher
    message = CheckerBoard.get_game_players(game_name)
              |> Map.merge(
                   %{
                     "squares" => CheckerBoard.grid_colors(),
                     "pieces" => CheckerBoard.get_game_pieces(game_name),
                     "player_role" => socket.assigns[:player_role]
                   }
                 )
              |> Map.merge(CheckerBoard.get_game_turn(game_name))
              |> Map.merge(CheckerBoard.get_game_score(game_name))
    {:ok, message, socket}
  end

  def handle_in("move_msg", %{"from" => from, "to" => to}, socket) do
    game_name = socket.assigns[:game_name]
    player_role = socket.assigns[:player_role]
    newpieces = CheckerBoard.move_piece(game_name, player_role, from, to)
    message = CheckerBoard.get_game_players(game_name)
              |> Map.merge(%{"pieces" => newpieces})
              |> Map.merge(CheckerBoard.get_game_turn(game_name))
              |> Map.merge(CheckerBoard.get_game_score(game_name))
    broadcast! socket, "game_update", message
    {:noreply, socket}
  end

  def handle_in("player_joined", _message, socket) do
    game_name = socket.assigns[:game_name]
    broadcast! socket, "player_update", CheckerBoard.get_game_players(game_name)
    broadcast_game_list()
    {:noreply, socket}
  end

  def handle_in("player_left", _message, socket) do
    game_name = socket.assigns[:game_name]
    player_role = socket.assigns[:player_role]
    case CheckerBoard.leave_game(game_name, player_role) do
      {:publish} ->
        broadcast! socket, "player_left", CheckerBoard.get_game_players(game_name)
        broadcast_game_list()
        {:noreply, socket}
      {:ok} -> {:noreply, socket}
    end
  end

  def handle_in("game_reset", _message, socket) do
    game_name = socket.assigns[:game_name]
    player_role = socket.assigns[:player_role]
    CheckerBoard.reset_game(game_name)
    message = CheckerBoard.get_game_players(game_name)
              |> Map.merge(
                   %{
                     "squares" => CheckerBoard.grid_colors(),
                     "pieces" => CheckerBoard.get_game_pieces(game_name)
                   }
                 )
              |> Map.merge(CheckerBoard.get_game_turn(game_name))
              |> Map.merge(CheckerBoard.get_game_score(game_name))
    broadcast! socket, "game_reset", message
    {:noreply, socket}
  end

  def broadcast_game_list() do
    CheckersWeb.Endpoint.broadcast "lobby", "game_start", %{"game_list" => CheckerBoard.get_all_games()}
  end


end
