import React from 'react';
import ReactDOM from 'react-dom';
import CheckerPiece from "./checker_piece";
import King from "./king";
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BoardSquare from './board_square';
import {PieceTypes} from './piece_types';


/**
 * Board component based on react-dnd.
 * @citation https://react-dnd.github.io/react-dnd/examples-chessboard-tutorial-app.html
 */
class Board extends React.Component {
    constructor(props) {
        super(props);
    }


    calculatePosition(i) {
        const x = (i % 8);
        const y = Math.floor(i / 8);
        return [x, y];
    }

    calculateIndexFromXY(x, y) {
        let i = Math.ceil(y * 8) + x;
        return i;
    }

    canMove(from, to) {
        if (this.props.turn != this.props.player_role) {
            // not players turn
            return true;
        } else if (this.props.status == -1) {
            // game ended status
            return true;
        }
        let pieces = this.props.pieces;
        const [x, y] = this.calculatePosition(from);
        const [dx, dy] = this.calculatePosition(to);

        let pieceType = this.mapPieceType(pieces[from]);
        let single = false;
        let double = false;
        let kill = false;
        switch (pieceType) {
            case PieceTypes.WHITE_CHECKER:
                // check single jump
                single = (y - dy) == 1 && Math.abs(dx - x) == 1 && pieces[to] == 0;
                if (single) {
                    return true;
                }
                // check killer jump
                double = (y - dy) == 2 && Math.abs(dx - x) == 2 && pieces[to] == 0;
                kill = ((x > dx) && (pieces[this.calculateIndexFromXY((x - 1), y - 1)] < 0))
                    || ((x < dx) && (pieces[this.calculateIndexFromXY((x + 1), y - 1)] < 0));
                return double && kill;
            case PieceTypes.BLACK_CHECKER:
                // check single jump
                single = (dy - y) == 1 && Math.abs(dx - x) == 1 && pieces[to] == 0;
                if (single) {
                    return true;
                }
                // check killer jump
                double = (dy - y) == 2 && Math.abs(dx - x) == 2 && pieces[to] == 0;
                kill = ((x > dx) && (pieces[this.calculateIndexFromXY((x - 1), y + 1)] > 0))
                    || ((x < dx) && (pieces[this.calculateIndexFromXY((x + 1), y + 1)] > 0));
                return double && kill;
            case PieceTypes.WHITE_KING:
                single = Math.abs(dx - x) == 1 && Math.abs(dy - y) == 1 && pieces[to] == 0;
                if (single) {
                    return true;
                }
                double = Math.abs(dx - x) == 2 && Math.abs(dy - y) == 2 && pieces[to] == 0;
                kill = ((x > dx && y > dy) && (pieces[this.calculateIndexFromXY((x - 1), y - 1)] < 0))
                    || ((x < dx && y > dy) && (pieces[this.calculateIndexFromXY((x + 1), y - 1)] < 0))
                    || ((x > dx && y < dy) && (pieces[this.calculateIndexFromXY((x - 1), y + 1)] < 0))
                    || ((x < dx && y < dy) && (pieces[this.calculateIndexFromXY((x + 1), y + 1)] < 0));
                return double && kill;
            case PieceTypes.BLACK_KING:
                single = Math.abs(dx - x) == 1 && Math.abs(dy - y) == 1 && pieces[to] == 0;
                if (single) {
                    return true;
                }
                double = Math.abs(dx - x) == 2 && Math.abs(dy - y) == 2 && pieces[to] == 0;
                kill = ((x > dx && y > dy) && (pieces[this.calculateIndexFromXY((x - 1), y - 1)] > 0))
                    || ((x < dx && y > dy) && (pieces[this.calculateIndexFromXY((x + 1), y - 1)] > 0))
                    || ((x > dx && y < dy) && (pieces[this.calculateIndexFromXY((x - 1), y + 1)] > 0))
                    || ((x < dx && y < dy) && (pieces[this.calculateIndexFromXY((x + 1), y + 1)] > 0));
                return double && kill;
            default:
                return false;
        }
    }

    mapPieceType(pieceval) {
        let piece;
        switch (pieceval) {
            case 1:
                piece = PieceTypes.WHITE_CHECKER;
                break;
            case -1:
                piece = PieceTypes.BLACK_CHECKER;
                break;
            case 2:
                piece = PieceTypes.WHITE_KING;
                break;
            case -2:
                piece = PieceTypes.BLACK_KING;
                break;
            default:
                piece = null;
        }
        return piece;
    }

    renderSquare(i) {
        let color = this.props.squares[i];
        let piece = this.mapPieceType(this.props.pieces[i]);

        return (
            <div key={i} style={{width: '12.5%', height: '12.5%'}}>
                <BoardSquare color={color} piece={piece} index={i}
                             canMove={(from, to) => this.canMove(from, to)}
                             makeMove={(from, to) => this.props.makeMove(from, to)}>
                </BoardSquare>
            </div>
        );
    }


    render() {
        const squares = [];
        for (let i = 0; i < this.props.squares.length; i++) {
            squares.push(this.renderSquare(i));
        }

        return (
            <div className="board">
                {squares}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Board);

