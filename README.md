# Checkers
## Multi-player Checkers Game build using Phoenix framework and React JS.

## Design Choices for Checkers

You can visit the application [here](http://checkers.curiousmind.tech/)

=======================================================================
### Checkers Board
Checkers is a two player board game application that makes diagonal moves and kills to win over an opponent player. The game board is a checker board made up of 64 square tiles. There will be 8 rows and 8 columns, and the square tiles have alternating black tile and white tile. When the game begins each of the players gets to see the checker board with checker pieces in place. There are 12 pieces for each of the players. One player has blue colored pieces, and the opponent player had orange colored pieces. When the game begins all the player’s pieces will be lined up on one side and the opponent’s pieces on the other side. As the game progresses each of the player’s intentions are to put the opponent’s pieces in a vulnerable position and jump over the opponent’s pieces to kill and remove them from the checker board. The player who first removes all of the opponent’s pieces removes them from the board wins the game.

=======================================================================
### Game Rules
A player can move his piece forward, one tile diagonally at a time. Player selects the piece to move around the checker board. A player seizes an opponent’s piece by jumping over their piece with his own piece. The goal of a player’s moves should be to put your opponent’s pieces in a bad position. Whenever the player has an opponent’s piece in a vulnerable position to be captured, a jump should take place. Upon reaching the opposite side of the checkers board (the opponent’s side), the piece will turn into king. The king has an additional benefit of moving forward and backward unlike other pieces. Whenever a player makes a move, the opponent’s and the observer’s screens get updated. A player can exit the game at any moment he wishes to. Upon exiting a game, the game state is preserved and is open for anyone to join, including the observers.

=======================================================================

### Application Design
The checker game welcomes any user to create and play a new game, play an existing game or simply watch and enjoy an ongoing game. The application has the features of creating game name instances, seeing the list of all active games and their statuses and and additional opportunity to watch ongoing games by entering into the game room created by other users. Any number of spectators can continously watch an ongoing game.

A score board is displayed on the side of the screen which shares the information as to who’s move is next and what are the scores of each of the players. There are exit and reset buttons available in the game room, which the players can use to exit the game at their discretion. The reset button will set the pieces to the initial state if any of the players wishes to start from beginning. 


To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.


## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
