import React from 'react';
import './ChessboardContainer.css';

import {determineValidPieceMoves, getKingPosition, isKingInCheck, playerHasValidMoves, getAllPieceCoordsByColor} from '../utilities/moveEngine.js'
import Chessboard from './Chessboard';
import BoardNotationOverlay from './BoardNotationOverlay';
import ChessboardPieces from './ChessboardPieces';
import ValidMoveSquares from './ValidMoveSquares';
import ActionsContainer from './ActionsContainer';
import PawnPromotionOptions from './PawnPromotionOptions';
import EndOfGameDisplay from './EndOfGameDisplay';

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
            gameOver: false,
            outcome: '',
            winner: '',
            boardOrientation: 'white',
            currentPlayer: 'white',
            activePiece: {row: -1, col: -1},
            lastMoveStart: {row: -1, col: -1},
            lastMoveEnd: {row: -1, col: -1},
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


    evaluateIfEndOfGame = (boardState, currentPlayer, nextPlayerColor, nextPlayerInCheck) => {
        let isEndOfGame = false;
        let nextPlayerPieces = getAllPieceCoordsByColor(boardState, nextPlayerColor);
        let currentPlayerPieces = [];
        let nextPlayerHasAvaliableMove;

        if (nextPlayerPieces.length === 1) {
            currentPlayerPieces = getAllPieceCoordsByColor(boardState, currentPlayer.charAt(0));

            if (currentPlayerPieces.length === 1) {
                this.setState({
                    gameOver: true,
                    outcome: 'draw',
                    winner: '',
                });

                isEndOfGame = true;
            }
        }

        nextPlayerHasAvaliableMove = playerHasValidMoves(this.state.gameState, boardState, nextPlayerPieces);

        if (isEndOfGame === false && nextPlayerHasAvaliableMove === false) {
            isEndOfGame = true;

            if (nextPlayerInCheck === true) {
                this.setState({
                    gameOver: true,
                    outcome: 'checkmate',
                    winner: currentPlayer,
                });
            }
            else {
                this.setState({
                    gameOver: true,
                    outcome: 'stalemate',
                    winner: '',
                });  
            }
        }
        
        return isEndOfGame;
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
        let nextPlayerColor;
        let kingPosition;
        let nextPlayerInCheck;

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

        if (piece.charAt(0) === 'k' 
            && (
                (piece.charAt(1) === 'w' && oldRow === 0)
                || (piece.charAt(1) === 'b' && oldRow === 7)
            )
        ) {
            this.setState(state => {state.gameState[currentPlayer].kingMoved = true; return state});
        }

        if (piece.charAt(0) === 'r' 
            && (
                (piece.charAt(1) === 'w' && oldRow === 0)
                || (piece.charAt(1) === 'b' && oldRow === 7)
            )
        ) {
            if (oldCol === 0) {
                this.setState(state => {state.gameState[currentPlayer].queensRookMoved = true; return state});
            }
            else if (oldCol === 7) {
                this.setState(state => {state.gameState[currentPlayer].kingsRookMoved = true; return state});
            }
        }

        this.setState(state => {state.gameState[currentPlayer].enPassantablePawn = enPassantablePawn; return state});
        this.setState(state => {state.gameState[currentPlayer].inCheck = false; return state});
        this.setState(state => {state.gameState[nextPlayer].enPassantablePawn = {}; return state});
        
        this.setState({
            boardPositions: newBoardState, 
            displayPromotionOptions: displayPromotionOptions,
            promoteColumn: promoteColumn,
            activePiece: {}, 
            lastMoveStart: {row: oldRow, col: oldCol},
            lastMoveEnd: {row: toRow, col: toCol},
            validMoveSquares: [],
            currentPlayer: nextPlayer
        });

        if (displayPromotionOptions === true) {
            return;
        }

        nextPlayerColor = nextPlayer.charAt(0);
        kingPosition = getKingPosition(nextPlayerColor, newBoardState);
        nextPlayerInCheck = isKingInCheck(kingPosition, nextPlayerColor, newBoardState);

        if (nextPlayerInCheck === true) {
            this.setState(state => {state.gameState[nextPlayer].inCheck = true; return state});
        }

        this.evaluateIfEndOfGame(newBoardState, currentPlayer, nextPlayerColor, nextPlayerInCheck);
    }

    selectPromotionChoice = (newPiece, row, col) => {
        let newBoardState = JSON.parse(JSON.stringify(this.state.boardPositions));
        let currentPlayer = this.state.currentPlayer;
        let pieceColor = (currentPlayer === 'white') ? 'w' : 'b';
        let nextPlayer = (currentPlayer === 'white') ? 'black' : 'white';
        let nextPlayerColor = nextPlayer.charAt(0);
        let kingPosition;
        let nextPlayerInCheck;
        
        newBoardState[row][col] = newPiece + pieceColor;

        this.setState({
            boardPositions: newBoardState, 
            displayPromotionOptions: false,
            promoteColumn: -1,
            activePiece: {}, 
            validMoveSquares: [],
            currentPlayer: nextPlayer
        });

        nextPlayerColor = nextPlayer.charAt(0);
        kingPosition = getKingPosition(nextPlayerColor, newBoardState);
        nextPlayerInCheck = isKingInCheck(kingPosition, nextPlayerColor, newBoardState);

        if (nextPlayerInCheck === true) {
            this.setState(state => {state.gameState[nextPlayer].inCheck = true; return state});
        }

        this.evaluateIfEndOfGame(newBoardState, currentPlayer, nextPlayerColor, nextPlayerInCheck);
    }

    

    render () {
        return (
            <React.Fragment>
                <div className="board-wrapper">
                    <Chessboard 
                        clearMoveIndicators={this.clearValidMoves}
                        boardOrientation={this.state.boardOrientation}
                        lastMoveStart={this.state.lastMoveStart}
                        lastMoveEnd={this.state.lastMoveEnd}/>
                    <BoardNotationOverlay boardOrientation={this.state.boardOrientation} />
                    <ChessboardPieces 
                        boardPositions={this.state.boardPositions} 
                        boardOrientation={this.state.boardOrientation}
                        determineValidMoves={this.determineValidMoves}
                        whiteInCheck={this.state.gameState.white.inCheck}
                        blackInCheck={this.state.gameState.black.inCheck}/>
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
                    {this.state.gameOver && 
                        <EndOfGameDisplay endType={this.state.outcome} winner={this.state.winner}/>
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