import React from 'react';
import './Chessboard.css';
import {ReactComponent as Board} from '../assets/img/chessboard.svg'; 
import {determineValidPieceMoves} from '../utilities/moveEngine.js'
import Piece from './Piece'
import ValidMoveSquares from './ValidMoveSquares';

class Chessboard extends React.Component {
    constructor (props) {
        super(props);

        this.pieceMap = {
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
        
        let boardPositions = [
            ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw'],
            ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
            ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb']
        ];

       let pieceComponents = [];

        boardPositions.forEach((row, row_index) => {
            row.forEach((piece, col_index) => {
                if (piece === '') { return; }

                let pieceType = this.pieceMap.piece[piece.charAt(0)];
                let pieceColor = this.pieceMap.color[piece.charAt(1)];

                
                pieceComponents.push((
                    <Piece 
                        key={row_index + '-' + col_index} 
                        color={pieceColor} 
                        piece={pieceType} 
                        row={row_index} 
                        col={col_index} 
                        determineValidMoves={this.determineValidMoves} />
                ))
            });
        });

        this.state = {
            activePiece: {row: -1, col: -1},
            validMoveSquares: [],
            boardPositions: boardPositions,
            pieceComponents: pieceComponents,
            gameState: {
                white: {
                    inCheck: false,
                    enPassantablePawn: {row: 3, col: 4},
                    kingMoved: false,
                    kingsRookMoved: false,
                    queensRookMoved: false
                },
                black: {
                    inCheck: false,
                    enPassantablePawn: {},
                    kingMoved: false,
                    kingsRookMoved: false,
                    queensRookMoved: false
                }
            }
        }
    }


    updatePieceComponents = () => {
        let pieceComponents = [];

        this.state.boardPositions.forEach((row, row_index) => {
            row.forEach((piece, col_index) => {
                if (piece === '') { return; }

                let pieceType = this.pieceMap.piece[piece.charAt(0)];
                let pieceColor = this.pieceMap.color[piece.charAt(1)];

                
                pieceComponents.push((
                    <Piece 
                        key={row_index + '-' + col_index} 
                        color={pieceColor} 
                        piece={pieceType} 
                        row={row_index} 
                        col={col_index} 
                        determineValidMoves={this.determineValidMoves} />
                ))
            });
        });

        this.setState({pieceComponents: pieceComponents});
    }

    
    displayValidMoveSquares = (validMoves) => {
        this.setState({validMoveSquares: validMoves});
    }

    determineValidMoves = (row, col) => {
        this.setState({activePiece: {row: row, col: col}});
        let validMoves = determineValidPieceMoves(this.state.gameState, this.state.boardPositions, row, col);

        if (validMoves.length > 0) {
            this.displayValidMoveSquares(validMoves);
        }
        else {
            this.setState({validMoveSquares: []});
        }
    }

    clearValidMoves = () => {
        this.setState({validMoveSquares: [], activePiece: {}});
    }

    selectMoveChoice = (toRow, toCol) => {
        let newBoardState = JSON.parse(JSON.stringify(this.state.boardPositions));
        let oldPosition = this.state.activePiece;
        let oldRow = oldPosition.row;
        let oldCol = oldPosition.col;
        let piece = newBoardState[oldRow][oldCol];

        newBoardState[oldRow][oldCol] = '';
        newBoardState[toRow][toCol] = piece;

        this.setState({boardPositions: newBoardState, activePiece: {}, validMoveSquares: []}, this.updatePieceComponents);
    }

    render () {
        return (
            <React.Fragment>
                <div className="board-wrapper">
                    <Board onClick={this.clearValidMoves} />
                    {this.state.pieceComponents}
                    <ValidMoveSquares locations={this.state.validMoveSquares} selectMoveChoice={this.selectMoveChoice} />
                </div>
            </React.Fragment>
        )
    }
}

export default Chessboard;