import React from 'react';
import './ChessboardContainer.css';

import {determineValidPieceMoves} from '../utilities/moveEngine.js'
import Chessboard from './Chessboard';
import BoardNotationOverlay from './BoardNotationOverlay';
import ChessboardPieces from './ChessboardPieces';
import ValidMoveSquares from './ValidMoveSquares';
import ActionsContainer from './ActionsContainer';
import PawnPromotionOptions from './PawnPromotionOptions';

class ChessboardContainer extends React.Component {
    constructor (props) {
        super(props);

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

        this.state = {
            boardOrientation: 'white',
            currentPlayer: 'white',
            activePiece: {row: -1, col: -1},
            displayPromotionOptions: false,
            promoteColumn: -1,
            validMoveSquares: [],
            boardPositions: boardPositions,
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

    flipBoardOrientation = () => {
        let nextBoardOrientation = (this.state.boardOrientation === 'white') ? 'black' : 'white';
        this.setState({boardOrientation: nextBoardOrientation});
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
        let displayPromotionOptions = false;
        let promoteColumn = -1;

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

        if (piece.charAt(0) === 'p'
            && (
                (piece.charAt(1) === 'w' && toRow === 7) 
                || (piece.charAt(1) === 'b' && toRow === 0) 
            )
        ) {
            displayPromotionOptions = true;
            promoteColumn = toCol;
            nextPlayer = currentPlayer;
        }

        this.setState(state => {state.gameState[currentPlayer].enPassantablePawn = enPassantablePawn; return state});
        this.setState(state => {state.gameState[nextPlayer].enPassantablePawn = {}; return state});

        this.setState({
            boardPositions: newBoardState, 
            displayPromotionOptions: displayPromotionOptions,
            promoteColumn: promoteColumn,
            activePiece: {}, 
            validMoveSquares: [],
            currentPlayer: nextPlayer
        });
    }

    selectPromotionChoice = (newPiece, row, col) => {
        let newBoardState = JSON.parse(JSON.stringify(this.state.boardPositions));
        let pieceColor = (this.state.currentPlayer === 'white') ? 'w' : 'b';
        let nextPlayer = (this.state.currentPlayer === 'white') ? 'black' : 'white';
        
        newBoardState[row][col] = newPiece + pieceColor;

        this.setState({
            boardPositions: newBoardState, 
            displayPromotionOptions: false,
            promoteColumn: -1,
            activePiece: {}, 
            validMoveSquares: [],
            currentPlayer: nextPlayer
        });
    }

    render () {
        return (
            <React.Fragment>
                <div className="board-wrapper">
                    <Chessboard />
                    <BoardNotationOverlay boardOrientation={this.state.boardOrientation} />
                    <ChessboardPieces 
                        boardPositions={this.state.boardPositions} 
                        boardOrientation={this.state.boardOrientation}
                        determineValidMoves={this.determineValidMoves}/>
                    <ValidMoveSquares 
                        locations={this.state.validMoveSquares} 
                        selectMoveChoice={this.selectMoveChoice} 
                        boardOrientation={this.state.boardOrientation}/>
                    {this.state.displayPromotionOptions && 
                        <PawnPromotionOptions 
                            boardOrientation={this.state.boardOrientation} 
                            col={this.state.promoteColumn}
                            color={this.state.currentPlayer}
                            selectPromotionChoice={this.selectPromotionChoice}/>
                    }
                </div>
                <div className="actions-pane">
                    <ActionsContainer flipBoardOrientation={this.flipBoardOrientation} />
                </div>
            </React.Fragment>
        )
    }
}

export default ChessboardContainer;