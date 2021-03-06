import React from 'react';
import ReactDOM from 'react-dom';
import { PieceTypes } from './piece_types';
import { DragSource } from 'react-dnd';


const kingSource = {
    beginDrag(props) {
        return {pieceindex: props.index};
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        connectDragPreview: connect.dragPreview()
    }
}


class King extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { connectDragSource, isDragging } = this.props;

        return connectDragSource(
            <div style={{
                opacity: isDragging ? 0.5 : 1,
                fontSize: '5vh',
                fontWeight: 'bold',
                cursor: 'move'
            }}>
                ♔
            </div>
        );
    }
}

export default DragSource(PieceTypes.KING, kingSource, collect)(King);



