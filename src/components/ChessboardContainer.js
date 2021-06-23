import React from 'react';
import {cloneDeep} from 'lodash';

import './ChessboardContainer.css';

import {
    determineValidPieceMoves, 
    getKingPosition, 
    isKingInCheck, 
    evaluateIfEndOfGame, 
    isPieceEnPassantable, 
    isPiecePromotable, 
    hasKingMoved, 
    hasKingSideRookMoved, 
    hasQueenSideRookMoved
} from '../utilities/moveEngine.js'
import Chessboard from './Chessboard';
import BoardNotationOverlay from './BoardNotationOverlay';
import ChessboardPieces from './ChessboardPieces';
import ValidMoveSquares from './ValidMoveSquares';
import ActionsContainer from './ActionsContainer';
import PawnPromotionOptions from './PawnPromotionOptions';
import EndOfGameDisplay from './EndOfGameDisplay';


const initialState = {
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
    boardPositions: [
        ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw'],
        ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
        ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb']
    ],
    enPassantablePawn: {},
    whiteInCheck: false,
    blackInCheck: false,
    whiteKingMoved: false,
    blackKingMoved: false,
    whiteKingsRookMoved: false,
    blackKingsRookMoved: false,
    whiteQueensRookMoved: false,
    blackQueensRookMoved: false
}

class ChessboardContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = initialState;
    }

    getGameState = () => {
        return {
            enPassantablePawn: this.state.enPassantablePawn,
            white: {
                inCheck: this.state.whiteInCheck,
                kingMoved: this.state.whiteKingMoved,
                kingsRookMoved: this.state.whiteKingsRookMoved,
                queensRookMoved: this.state.whiteQueensRookMoved
            },
            black: {
                inCheck: this.state.blackInCheck,
                kingMoved: this.state.blackKingMoved,
                kingsRookMoved: this.state.blackKingsRookMoved,
                queensRookMoved: this.state.blackQueensRookMoved
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
        validMoves = determineValidPieceMoves(this.getGameState(), this.state.boardPositions, row, col);

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

    setStateForNextPlayer = (currentPlayer, nextPlayer, boardState) => {
        let nextPlayerColor = nextPlayer.charAt(0);
        let kingPosition = getKingPosition(nextPlayerColor, boardState);
        let nextPlayerInCheck = isKingInCheck(kingPosition, nextPlayerColor, boardState);
        let whiteInCheck = false;
        let blackInCheck = false;

        if (nextPlayerInCheck === true) {
            if (nextPlayer === 'white') {
                whiteInCheck = true;
            }
            else {
                blackInCheck = true;
            }
            this.setState({
                whiteInCheck: whiteInCheck, 
                blackInCheck: blackInCheck
            });
        }

        let endOfGame = evaluateIfEndOfGame(this.getGameState(), boardState, currentPlayer, nextPlayerColor, nextPlayerInCheck);

        if (endOfGame.isEndOfGame === true) {
            this.setState({
                gameOver: true,
                outcome: endOfGame.endType,
                winner: (endOfGame.endType === 'checkmate') ? currentPlayer : '',
            });
        }
    }

    selectMoveChoice = (toRow, toCol, moveType, moveSubType) => {
        let newBoardState = cloneDeep(this.state.boardPositions);
        let oldPosition = this.state.activePiece;
        let oldRow = oldPosition.row;
        let oldCol = oldPosition.col;
        let piece = newBoardState[oldRow][oldCol];
        let currentPlayer = this.state.currentPlayer;
        let nextPlayer = (currentPlayer === 'white') ? 'black' : 'white';
        let currentEnPassantablePawn = this.state.enPassantablePawn;
        let enPassantablePawn = {};
        let displayPromotionOptions = false;
        let promoteColumn = -1;

        newBoardState[oldRow][oldCol] = '';
        newBoardState[toRow][toCol] = piece;

        switch (piece.charAt(0)) {
            case 'p':
                if (isPiecePromotable(piece, toRow)) {
                    displayPromotionOptions = true;
                    promoteColumn = toCol;
                    nextPlayer = currentPlayer;
                }
                else if (isPieceEnPassantable(piece, oldRow, toRow)) {
                    enPassantablePawn = {row: toRow, col: toCol, color: currentPlayer}; 
                }
                else if (moveSubType && moveSubType === 'enPassant') {
                    newBoardState[currentEnPassantablePawn.row][currentEnPassantablePawn.col] = '';
                }
                break;
            
            case 'k':
                if (moveSubType && moveSubType === 'castleKingSide') {
                    newBoardState[toRow][7] = '';
                    newBoardState[toRow][5] = 'r' + piece.charAt(1);
                }
                else if (moveSubType && moveSubType === 'castleQueenSide') {
                    newBoardState[toRow][0] = '';
                    newBoardState[toRow][3] = 'r' + piece.charAt(1);
                }

                if (hasKingMoved(piece, oldRow)) {
                    this.setState(state => {state[currentPlayer + 'KingMoved'] = true; return state});
                }
                break;

            case 'r':
                if (hasKingSideRookMoved(piece, oldRow, oldCol)) {
                    this.setState(state => {state[currentPlayer + 'KingsRookMoved'] = true; return state});
                }
                else if (hasQueenSideRookMoved(piece, oldRow, oldCol)) {
                    this.setState(state => {state[currentPlayer + 'QueensRookMoved'] = true; return state});
                }
                break;

            default:
                break;
        }

        this.setState({
            boardPositions: newBoardState, 
            displayPromotionOptions: displayPromotionOptions,
            promoteColumn: promoteColumn,
            activePiece: {}, 
            lastMoveStart: {row: oldRow, col: oldCol},
            lastMoveEnd: {row: toRow, col: toCol},
            validMoveSquares: [],
            currentPlayer: nextPlayer,
            enPassantablePawn: enPassantablePawn,
            whiteInCheck: false,
            blackInCheck: false
        });

        if (displayPromotionOptions === true) {
            return;
        }

        this.setStateForNextPlayer(currentPlayer, nextPlayer, newBoardState);
    }

    selectPromotionChoice = (newPiece, row, col) => {
        let newBoardState = cloneDeep(this.state.boardPositions);
        let currentPlayer = this.state.currentPlayer;
        let pieceColor = (currentPlayer === 'white') ? 'w' : 'b';
        let nextPlayer = (currentPlayer === 'white') ? 'black' : 'white';
        
        newBoardState[row][col] = newPiece + pieceColor;

        this.setState({
            boardPositions: newBoardState, 
            displayPromotionOptions: false,
            promoteColumn: -1,
            activePiece: {}, 
            validMoveSquares: [],
            currentPlayer: nextPlayer
        });

        this.setStateForNextPlayer(currentPlayer, nextPlayer, newBoardState);
    }


    restartGame = () => {
        this.setState(initialState);
    }

    
    render () {
        return (
            <React.Fragment>
                <div className="board-wrapper">
                    <Chessboard 
                        clearMoveIndicators={this.clearValidMoves}
                        boardOrientation={this.state.boardOrientation}
                        lastMoveStart={this.state.lastMoveStart}
                        lastMoveEnd={this.state.lastMoveEnd}
                    />
                    <BoardNotationOverlay boardOrientation={this.state.boardOrientation} />
                    <ChessboardPieces 
                        boardPositions={this.state.boardPositions} 
                        boardOrientation={this.state.boardOrientation}
                        determineValidMoves={this.determineValidMoves}
                        whiteInCheck={this.state.whiteInCheck}
                        blackInCheck={this.state.blackInCheck}
                    />
                    <ValidMoveSquares 
                        locations={this.state.validMoveSquares} 
                        selectMoveChoice={this.selectMoveChoice} 
                        boardOrientation={this.state.boardOrientation}
                    />
                    {this.state.displayPromotionOptions && 
                        <PawnPromotionOptions 
                            boardOrientation={this.state.boardOrientation} 
                            col={this.state.promoteColumn}
                            color={this.state.currentPlayer}
                            selectPromotionChoice={this.selectPromotionChoice}
                        />
                    }
                    {this.state.gameOver && 
                        <EndOfGameDisplay 
                            endType={this.state.outcome} 
                            winner={this.state.winner}
                        />
                    }
                </div>
                <div className="actions-pane">
                    <ActionsContainer 
                        restartGame={this.restartGame}
                        flipBoardOrientation={this.flipBoardOrientation} 
                    />
                </div>
            </React.Fragment>
        )
    }
}

export default ChessboardContainer;