import React, {Component} from 'react';
import Square from './square';
import {PieceTypes} from './piece_types';
import {DropTarget} from 'react-dnd';
import CheckerPiece from './checker_piece';
import King from './king';

const squareTarget = {
    canDrop(props, monitor) {
        const from = monitor.getItem().pieceindex;
        const to = props.index;
        return props.canMove(from, to);
    },
    drop(props, monitor) {
        const from = monitor.getItem().pieceindex;
        const to = props.index;
        props.makeMove(from, to);

    }

};


function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}


class BoardSquare extends React.Component {
    constructor(props) {
        super(props);
    }

    showOverlay(color) {
        return (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                opacity: 0.5,
                backgroundColor: color,
            }}/>
        );
    }

    renderPieceType() {
        let piece = this.props.piece;
        switch (piece) {
            case PieceTypes.WHITE_CHECKER:
                return <CheckerPiece index={this.props.index}/>
            case PieceTypes.BLACK_CHECKER:
                return <CheckerPiece index={this.props.index}/>
            case PieceTypes.BLACK_KING:
                return <King index={this.props.index}/>
            case PieceTypes.WHITE_KING:
                return <King index={this.props.index}/>
            default:
                return null;
        }

    }

    getPieceColor() {
        let piece = this.props.piece;
        switch (piece) {
            case PieceTypes.WHITE_CHECKER:
                return 1;
            case PieceTypes.BLACK_CHECKER:
                return -1;
            case PieceTypes.BLACK_KING:
                return -1;
            case PieceTypes.WHITE_KING:
                return 1;
        }

    }

    render() {
        const {index, connectDropTarget, isOver, canDrop} = this.props;

        return connectDropTarget(
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}>
                <Square color={this.props.color} piececolor={this.getPieceColor()}>
                    {this.renderPieceType()}
                </Square>
                {isOver && !canDrop && this.showOverlay('red')}
                {!isOver && canDrop && this.showOverlay('yellow')}
                {isOver && canDrop && this.showOverlay('green')}
            </div>
        );

    }
}


export default DropTarget([PieceTypes.CHECKER, PieceTypes.KING], squareTarget, collect)(BoardSquare);