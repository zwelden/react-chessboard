import React from 'react';
import Piece from './Piece'

const ChessboardPieces = ({boardPositions, boardOrientation, determineValidMoves, whiteInCheck, blackInCheck}) => {
    const pieceMap = {
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

    const createPieceComponents = () => {
        let pieceComponents = [];

        boardPositions.forEach((row, row_index) => {
            row.forEach((piece, col_index) => {
                if (piece === '') { return; }

                let pieceType = pieceMap.piece[piece.charAt(0)];
                let pieceColor = pieceMap.color[piece.charAt(1)];

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

    let inCheckColor = '';

    if (whiteInCheck) {
        inCheckColor = 'white';
    } 
    else if (blackInCheck) {
        inCheckColor = 'black';
    }

    return (
        <React.Fragment>
            {createPieceComponents().map(piece => 
                <Piece 
                    orientation={boardOrientation}
                    key={piece.row + '-' + piece.col} 
                    color={piece.color} 
                    piece={piece.type} 
                    row={piece.row} 
                    col={piece.col} 
                    inCheck={(piece.type === 'king' && piece.color === inCheckColor)}
                    determineValidMoves={determineValidMoves} 
                />
            )}  
        </React.Fragment>
    );
}

export default ChessboardPieces;