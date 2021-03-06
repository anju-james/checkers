defmodule CheckersWeb.Router do
  use CheckersWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", CheckersWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/home", PageController, :home
    get "/game/watch/:gamename", PageController, :watchgame
    get "/game/join/:gamename", PageController, :joingame
    get "/rules", PageController, :rules
  end

  # Other scopes may use custom stacks.
  # scope "/api", CheckersWeb do
  #   pipe_through :api
  # end
end
