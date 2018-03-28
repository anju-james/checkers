import React from 'react';

class CreateGame extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            isOpen: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    handleClick(event) {
        event.preventDefault();
        const gameName = this.state.name;
        M.Toast.dismissAll();
        if (this.state.name.length == 0) {
            M.toast({html: 'Gamename cannot be empty', classes: 'orange-text'});
            return;
        } else {
            window.location.href = '/game/join/' + this.state.name;
        }

    }

    render() {
        return (
            <div>
                <br></br>
                <div className="row">
                    <h4 className="orange-text">Create a game</h4>
                    <div className="col s4">
                        <input placeholder="Game Name" id="name" type="text" value={this.state.name}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="col s4">
                        <a className="btn waves-effect waves-light orange" onClick={this.handleClick}>Create Game</a>
                    </div>
                </div>
                <br></br>
            </div>
        );
    }

}

export default CreateGame;

