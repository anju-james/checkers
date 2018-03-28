defmodule Checkers.CheckerBoard do

  alias Checkers.CheckerState

  @moduledoc """
  A module that handles the rules of the checker game.
  """

  # Initiating the board squares with respective colors
  def grid_colors do
    Enum.to_list(0..63)
    |> Enum.map(fn (i) -> [rem(i, 8), div(i, 8)] end)
    |> Enum.map(
         fn ([x, y]) ->
           cond do
             (rem(y, 2) == 1) && rem(x, 2) == 0 -> -1
             (rem(y, 2) == 0) && rem(x, 2) == 1 -> -1
             true -> 1
           end
         end
       )
  end


  def move_piece(game_name, player_role, from, to) do
    pieces = get_game_pieces(game_name)
    turn = CheckerState.get_game_state(game_name)[:turn]
    update_turn = false

    new_pieces = cond do
      !is_players_piece_to_move(turn, player_role, from, pieces) -> pieces
      get_game_score(game_name)[:status] != 1 -> pieces
      is_valid_single_move(from, to, pieces) ->
        update_turn = true
        List.replace_at(pieces, to, (Enum.at(pieces, from)))
        |> List.replace_at(from, 0)
        |> upgrade_pieces
      is_valid_double_move(from, to, pieces) ->
        update_turn = true
        List.replace_at(pieces, to, (Enum.at(pieces, from)))
        |> List.replace_at(from, 0)
        |> List.replace_at(kill_index(from, to, pieces), 0)
        |> upgrade_pieces
      true -> pieces
    end

    if update_turn do
      update_game_player_state(game_name, %{:turn => turn * -1})
      update_game_pieces_state(game_name, new_pieces)
    end
    new_pieces
  end


  def get_game_pieces(game_name) do
    CheckerState.get_game_state(game_name)[:pieces]
  end

  def get_game_players(game_name) do
    %{
      "player1open" => CheckerState.get_game_state(game_name)[:player1open],
      "player2open" => CheckerState.get_game_state(game_name)[:player2open]
    }
  end

  def get_game_turn(game_name) do
    %{"turn" => CheckerState.get_game_state(game_name)[:turn]}
  end

  def get_game_score(game_name) do
    if !CheckerState.known_game?(game_name) do
      %{:player1score => 0, :player2score => 0, :status => 0}
    else
      pieces = get_game_pieces(game_name)
      scores = %{
        :player1score => (12 - length(Enum.filter(pieces, fn (x) -> x > 0 end))),
        :player2score => (12 - length(Enum.filter(pieces, fn (x) -> x < 0 end)))
      }
      status = cond do
        (scores[:player1score] == 12 || scores[:player2score] == 12) -> %{:status => -1}
        true -> %{:status => 1}
      end
      Map.merge(scores, status)
    end
  end

  def get_all_games() do
    CheckerState.get_game_names()
    |> Enum.map(fn (x) -> Map.merge(%{"name" => x}, get_game_players(x)) end)
  end

  def create_game(game_name) do
    if !CheckerState.known_game?(game_name) do
      update_game_pieces_state(game_name, initial_piece_positions())
      update_game_player_state(game_name, %{:player1open => true, :player2open => true, :turn => -1})
    end
  end

  def reset_game(game_name) do
    update_game_pieces_state(game_name, initial_piece_positions())
  end

  def get_next_available_playerslot(game_name, watcher) do
    cond do
      watcher == true -> 0
      CheckerState.known_game?(game_name) ->
        state = CheckerState.get_game_state(game_name)
        cond do
          state[:player1open] ->
            update_game_player_state(game_name, %{:player1open => false})
            -1
          state[:player2open] ->
            update_game_player_state(game_name, %{:player2open => false})
            1
          true ->
            0
        end
      true -> 0
    end
  end

  def leave_game(game_name, player_role) do
    cond do
      player_role == 0 -> {:ok}
      player_role == -1 ->
        update_game_player_state(game_name, %{:player1open => true})
        {:publish}
      player_role == 1 ->
        update_game_player_state(game_name, %{:player2open => true})
        {:publish}
      true -> {:ok}
    end
  end

  defp is_players_piece_to_move(turn, player_role, from, pieces) do
    from_piece = Enum.at(pieces, from)
    cond do
      turn != player_role -> false
      from_piece < 0 and player_role == -1 -> true
      from_piece > 0 and player_role == 1 -> true
      true -> false
    end
  end

  defp update_game_pieces_state(game_name, pieces) do
    if CheckerState.known_game?(game_name) do
      current_state = CheckerState.get_game_state(game_name)
      new_state = Map.merge(current_state, %{"pieces": pieces})
      CheckerState.put_game_state(game_name, new_state)
    else
      CheckerState.put_game_state(game_name, %{"pieces": pieces})
    end
  end

  defp update_game_player_state(game_name, player_state) do
    if CheckerState.known_game?(game_name) do
      current_state = CheckerState.get_game_state(game_name)
      new_state = Map.merge(current_state, player_state)
      CheckerState.put_game_state(game_name, new_state)
    end
  end

  # Initiating the board for starting hte game with all checkers in places
  defp initial_piece_positions do
    Enum.to_list(0..63)
    |> Enum.map(fn (i) -> [rem(i, 8), div(i, 8)] end)
    |> Enum.map(
         fn ([x, y]) ->
           cond do
             (y == 0 || y == 2) && rem(x, 2) == 1 -> -1
             (y == 1) && rem(x, 2) == 0 -> -1
             (y == 5 || y == 7) && rem(x, 2) == 0 -> 1
             (y == 6) && rem(x, 2) == 1 -> 1
             true -> 0
           end
         end
       )
  end


  defp change_to_xy(i), do: [rem(i, 8), div(i, 8)]

  defp change_from_xy(x, y), do: y * 8 + x



  defp is_valid_single_move(from, to, pieces) do
    [x, y] = change_to_xy(from)
    [dx, dy] = change_to_xy(to)
    to_piece = Enum.at(pieces, to)

    case Enum.at(pieces, from) do
      1 -> (y - dy) == 1 and abs(dx - x) == 1 and to_piece == 0
      -1 -> (dy - y) == 1 and abs(dx - x) == 1 and to_piece == 0
      from_piece when from_piece == -2 or from_piece == 2 -> abs(dx - x) == 1 and abs(dy - y) == 1 and to_piece == 0
      _ -> false
    end
  end


  defp is_valid_double_move(from, to, pieces) do
    [x, y] = change_to_xy(from)
    [dx, dy] = change_to_xy(to)
    to_piece = Enum.at(pieces, to)

    case Enum.at(pieces, from) do
      1 ->
        (y - dy) == 2 and abs(dx - x) == 2 and to_piece == 0 and is_valid_kill(from, to, pieces)
      -1 ->
        (dy - y) == 2 and abs(dx - x) == 2 and to_piece == 0 and is_valid_kill(from, to, pieces)
      from_piece when from_piece == -2 or from_piece == 2 ->
        abs(dx - x) == 2 and abs(dy - y) == 2 and to_piece == 0 and is_valid_kill(from, to, pieces)
      _ ->
        false
    end
  end

  defp is_valid_kill(from, to, pieces) do
    [x, y] = change_to_xy(from)
    [dx, dy] = change_to_xy(to)
    to_piece = Enum.at(pieces, to)

    case Enum.at(pieces, from) do
      from_piece when from_piece > 0 -> Enum.at(pieces, kill_index(from, to, pieces)) < 0
      from_piece when from_piece < 0 -> Enum.at(pieces, kill_index(from, to, pieces)) > 0
      _ -> false
    end
  end

  defp upgrade_pieces(pieces) do
    Enum.with_index(pieces)
    |> Enum.map(
         fn (t) ->
           case t do
             {piece, index} when piece == -1 ->
               if Enum.at(change_to_xy(index), 1) == 7 do
                 -2
               else
                 -1
               end
             {piece, index} when piece == 1 ->
               if Enum.at(change_to_xy(index), 1) == 0 do
                 2
               else
                 1
               end
             {piece, index} when 1 == 1 -> piece
           end
         end
       )
  end

  defp kill_index(from, to, pieces) do
    [x, y] = change_to_xy(from)
    [dx, dy] = change_to_xy(to)

    case Enum.at(pieces, from) do
      1 when (x > dx) -> change_from_xy(x - 1, y - 1)
      1 when (x < dx) -> change_from_xy(x + 1, y - 1)
      -1 when (x > dx) -> change_from_xy(x - 1, y + 1)
      -1 when (x < dx) -> change_from_xy(x + 1, y + 1)
      king when (king == 2 or king == -2) and (x > dx and y > dy) -> change_from_xy(x - 1, y - 1)
      king when (king == 2 or king == -2) and (x < dx and y > dy) -> change_from_xy(x + 1, y - 1)
      king when (king == 2 or king == -2) and (x > dx and y < dy) -> change_from_xy(x - 1, y + 1)
      king when (king == 2 or king == -2) and (x < dx and y < dy) -> change_from_xy(x + 1, y + 1)
      _ -> 0
    end
  end


end