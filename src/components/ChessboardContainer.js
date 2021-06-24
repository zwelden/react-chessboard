import React, {useReducer} from 'react';
import {cloneDeep} from 'lodash';

import {initialState, reducer} from '../utilities/ChessBoardReducer';
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

import './ChessboardContainer.css';


const ChessboardContainer = (props) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const getGameState = () => {
        return {
            enPassantablePawn: state.enPassantablePawn,
            white: {
                inCheck: state.whiteInCheck,
                kingMoved: state.whiteKingMoved,
                kingsRookMoved: state.whiteKingsRookMoved,
                queensRookMoved: state.whiteQueensRookMoved
            },
            black: {
                inCheck: state.blackInCheck,
                kingMoved: state.blackKingMoved,
                kingsRookMoved: state.blackKingsRookMoved,
                queensRookMoved: state.blackQueensRookMoved
            }
        }
    }

    const determineValidMoves = (row, col) => {
        let validMoves = [];
        let selectedSquare = state.boardPositions[row][col];
        
        if (selectedSquare.charAt(1) !== state.currentPlayer.charAt(0)) {
            return;
        }

        validMoves = determineValidPieceMoves(getGameState(), state.boardPositions, row, col);

        dispatch({
            type: 'updateValidMoveSquares', 
            payload: {
                validMoveSquares: validMoves, 
                activePiece: {row: row, col: col}
            }
        });
    }

    const setStateForNextPlayer = (currentPlayer, nextPlayer, boardState) => {
        let nextPlayerColor = nextPlayer.charAt(0);
        let kingPosition = getKingPosition(nextPlayerColor, boardState);
        let nextPlayerInCheck = isKingInCheck(kingPosition, nextPlayerColor, boardState);
        let winner;
        let endType;

        if (nextPlayerInCheck === true) {
            dispatch({type: 'updatePlayerInCheck', payload: nextPlayer})
        }

        let endOfGame = evaluateIfEndOfGame(getGameState(), boardState, currentPlayer, nextPlayerColor, nextPlayerInCheck);

        if (endOfGame.isEndOfGame === true) {
            endType = endOfGame.endType;
            winner = (endType === 'checkmate') ? currentPlayer : '';
            dispatch({type: 'endGame', payload: {endType: endType, winner: winner}})
        }
    }

    const selectMoveChoice = (toRow, toCol, moveType, moveSubType) => {
        let newBoardState = cloneDeep(state.boardPositions);
        let oldPosition = state.activePiece;
        let oldRow = oldPosition.row;
        let oldCol = oldPosition.col;
        let piece = newBoardState[oldRow][oldCol];
        let currentPlayer = state.currentPlayer;
        let nextPlayer = (currentPlayer === 'white') ? 'black' : 'white';
        let currentEnPassantablePawn = state.enPassantablePawn;
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
                    dispatch({type: 'setData', field: currentPlayer + 'KingMoved', payload: true});
                }
                break;

            case 'r':
                if (hasKingSideRookMoved(piece, oldRow, oldCol)) {
                    dispatch({type: 'setData', field: currentPlayer + 'KingsRookMoved', payload: true});
                }
                else if (hasQueenSideRookMoved(piece, oldRow, oldCol)) {
                    dispatch({type: 'setData', field: currentPlayer + 'QueensRookMoved', payload: true});
                }
                break;

            default:
                break;
        }

        dispatch({
            type: 'updateStatePostMove',
            payload: {
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
            }
        });

        if (displayPromotionOptions === true) {
            return;
        }

        setStateForNextPlayer(currentPlayer, nextPlayer, newBoardState);
    }

    const selectPromotionChoice = (newPiece, row, col) => {
        let newBoardState = cloneDeep(state.boardPositions);
        let currentPlayer = state.currentPlayer;
        let pieceColor = (currentPlayer === 'white') ? 'w' : 'b';
        let nextPlayer = (currentPlayer === 'white') ? 'black' : 'white';
        
        newBoardState[row][col] = newPiece + pieceColor;

        dispatch({
            type: 'updateStatePostPromotion',
            payload: {
                boardPositions: newBoardState, 
                displayPromotionOptions: false,
                promoteColumn: -1,
                activePiece: {}, 
                validMoveSquares: [],
                currentPlayer: nextPlayer
            }
        });

        setStateForNextPlayer(currentPlayer, nextPlayer, newBoardState);
    }

    return (
        <React.Fragment>
            <div className="board-wrapper">
                <Chessboard 
                    clearMoveIndicators={() => {dispatch({type: 'clearValidMoveSquares'})}}
                    boardOrientation={state.boardOrientation}
                    lastMoveStart={state.lastMoveStart}
                    lastMoveEnd={state.lastMoveEnd}
                />
                <BoardNotationOverlay boardOrientation={state.boardOrientation} />
                <ChessboardPieces 
                    boardPositions={state.boardPositions} 
                    boardOrientation={state.boardOrientation}
                    determineValidMoves={determineValidMoves}
                    whiteInCheck={state.whiteInCheck}
                    blackInCheck={state.blackInCheck}
                />
                <ValidMoveSquares 
                    locations={state.validMoveSquares} 
                    selectMoveChoice={selectMoveChoice} 
                    boardOrientation={state.boardOrientation}
                />
                {state.displayPromotionOptions && 
                    <PawnPromotionOptions 
                        boardOrientation={state.boardOrientation} 
                        col={state.promoteColumn}
                        color={state.currentPlayer}
                        selectPromotionChoice={selectPromotionChoice}
                    />
                }
                {state.gameOver && 
                    <EndOfGameDisplay 
                        endType={state.outcome} 
                        winner={state.winner}
                    />
                }
            </div>
            <div className="actions-pane">
                <ActionsContainer 
                    restartGame={() => {dispatch({type: 'restartGame'})}}
                    flipBoardOrientation={() => dispatch({type: 'flipBoardOrientation'})} 
                />
            </div>
        </React.Fragment>
    );
}

export default ChessboardContainer;