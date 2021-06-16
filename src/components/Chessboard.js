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

       let pieceComponents = this.createPieceComponents(boardPositions)

        this.state = {
            currentPlayer: 'white',
            activePiece: {row: -1, col: -1},
            validMoveSquares: [],
            boardPositions: boardPositions,
            pieceComponents: pieceComponents,
            gameState: {
                white: {
                    inCheck: false,
                    enPassantablePawn: {},
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
        this.setState({pieceComponents: this.createPieceComponents(this.state.boardPositions)});
    }

    createPieceComponents = (boardPositions) => {
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

        return pieceComponents;
    }

    
    displayValidMoveSquares = (validMoves) => {
        this.setState({validMoveSquares: validMoves});
    }

    determineValidMoves = (row, col) => {
        let validMoves = [];
        let selectedSquare = this.state.boardPositions[row][col];
        
        if (selectedSquare.charAt(1) !== this.state.currentPlayer.charAt(0)) {
            return;
        }

        this.setState({activePiece: {row: row, col: col}});
        validMoves = determineValidPieceMoves(this.state.gameState, this.state.boardPositions, row, col);

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

    selectMoveChoice = (toRow, toCol, moveType, moveSubType) => {
        let newBoardState = JSON.parse(JSON.stringify(this.state.boardPositions));
        let oldPosition = this.state.activePiece;
        let oldRow = oldPosition.row;
        let oldCol = oldPosition.col;
        let piece = newBoardState[oldRow][oldCol];
        let currentPlayer = this.state.currentPlayer;
        let nextPlayer = (currentPlayer === 'white') ? 'black' : 'white';
        let currentEnPassantablePawn = this.state.gameState[nextPlayer].enPassantablePawn;
        let enPassantablePawn = {};

        newBoardState[oldRow][oldCol] = '';
        newBoardState[toRow][toCol] = piece;

        if (piece.charAt(0) === 'p'
            && (
                (piece.charAt(1) === 'w' && oldRow === 1 && toRow === 3) 
                || (piece.charAt(1) === 'b' && oldRow === 6 && toRow === 4) 
            )
        ) {
            enPassantablePawn = {row: toRow, col: toCol}; 
        }

        if (moveSubType && moveSubType === 'enPassant') {
            newBoardState[currentEnPassantablePawn.row][currentEnPassantablePawn.col] = '';
        }
        else if (moveSubType && moveSubType === 'castleKingSide') {
            newBoardState[toRow][7] = '';
            newBoardState[toRow][5] = 'r' + piece.charAt(1);
        }
        else if (moveSubType && moveSubType === 'castleQueenSide') {
            newBoardState[toRow][0] = '';
            newBoardState[toRow][3] = 'r' + piece.charAt(1);
        }

        this.setState(state => {state.gameState[currentPlayer].enPassantablePawn = enPassantablePawn; return state});
        this.setState(state => {state.gameState[nextPlayer].enPassantablePawn = {}; return state});

        this.setState({
            boardPositions: newBoardState, 
            activePiece: {}, 
            validMoveSquares: [],
            currentPlayer: nextPlayer,
            pieceComponents: [],

        }, this.updatePieceComponents);
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