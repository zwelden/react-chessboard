import React from 'react';
import Piece from './Piece'

class ChessboardPieces extends React.Component {
    pieceMap = {
        color: {
            'w': 'white',
            'b': 'black'
        },
        piece: {
            'r': 'rook',
            'n': 'knight',
            'b': 'bishop',
            'q': 'queen',
            'k': 'king',
            'p': 'pawn'
        }
    }

    createPieceComponents = (boardPositions) => {
        let pieceComponents = [];

        boardPositions.forEach((row, row_index) => {
            row.forEach((piece, col_index) => {
                if (piece === '') { return; }

                let pieceType = this.pieceMap.piece[piece.charAt(0)];
                let pieceColor = this.pieceMap.color[piece.charAt(1)];

                pieceComponents.push({
                    row: row_index,
                    col: col_index,
                    color: pieceColor,
                    type: pieceType
                });
            });
        });

        return pieceComponents;
    }

    render () {
        return (
            <React.Fragment>
                {this.createPieceComponents(this.props.boardPositions).map(piece => 
                    <Piece 
                    orientation={this.props.boardOrientation}
                    key={piece.row + '-' + piece.col} 
                    color={piece.color} 
                    piece={piece.type} 
                    row={piece.row} 
                    col={piece.col} 
                    determineValidMoves={this.props.determineValidMoves} />
                )}  
            </React.Fragment>
        )
    }
}

export default ChessboardPieces;