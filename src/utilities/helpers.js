import {cloneDeep} from 'lodash';
import { 
    getKingPosition, 
    isKingInCheck, 
    evaluateIfEndOfGame, 
    isPiecePromotable, 
    isPieceEnPassantable,
    hasKingMoved,
    hasKingSideRookMoved,
    hasQueenSideRookMoved } from "./moveEngine";


export const getGameState = (state) => {
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

export const determineStateForNextPlayer = (state, currentPlayer, nextPlayer, boardState) => {
    let nextPlayerColor = nextPlayer.charAt(0);
    let kingPosition = getKingPosition(nextPlayerColor, boardState);
    let nextPlayerInCheck = isKingInCheck(kingPosition, nextPlayerColor, boardState);
    let whiteInCheck = (nextPlayerInCheck && nextPlayer === 'white');
    let blackInCheck = (nextPlayerInCheck && nextPlayer === 'black');
    let endOfGame = {};
    let winner;
    let endType;
    let newState = {};
    
    newState = {
        ...state,
        whiteInCheck: whiteInCheck,
        blackInCheck: blackInCheck
    }

    endOfGame = evaluateIfEndOfGame(getGameState(state), boardState, currentPlayer, nextPlayerColor, nextPlayerInCheck);

    if (endOfGame.isEndOfGame === true) {
        endType = endOfGame.endType;
        winner = (endType === 'checkmate') ? currentPlayer : '';
    
        newState = {
            ...newState,
            gameOver: true,
            outcome: endType,
            winner: winner
        }
    }

    return newState;
}

export const constructStatePostMoveChoice = (state, toRow, toCol, moveType, moveSubType) => {
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
    let newState = {...state};
    let notation = '';
    let notationPiece = '';
    let notationCapture = '';
    let notationToSquare = '';
    let notationCheck = '';

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
                newState = {
                    ...newState,
                    [currentPlayer + 'KingMoved']: true
                }
            }
            break;

        case 'r':
            if (hasKingSideRookMoved(piece, oldRow, oldCol)) {
                newState = {
                    ...newState,
                    [currentPlayer + 'KingsRookMoved']: true
                }
            }
            else if (hasQueenSideRookMoved(piece, oldRow, oldCol)) {
                newState = {
                    ...newState,
                    [currentPlayer + 'QueensRookMoved']: true
                }
            }
            break;

        default:
            break;
    }

    newState = {
        ...newState,
        boardPositions: newBoardState, 
        displayPromotionOptions: displayPromotionOptions,
        promoteColumn: promoteColumn,
        lastMoveStart: {row: oldRow, col: oldCol},
        lastMoveEnd: {row: toRow, col: toCol},
        validMoveSquares: [],
        currentPlayer: nextPlayer,
        enPassantablePawn: enPassantablePawn,
        whiteInCheck: false,
        blackInCheck: false
    }

    if (displayPromotionOptions === true) {
        return newState;
    }

    newState = {...newState, activePiece: {}};

    newState = determineStateForNextPlayer(newState, currentPlayer, nextPlayer, newBoardState);

    if (piece.charAt(0) !== 'p') {
        notationPiece = piece.charAt(0).toUpperCase();
    }
    
    if (piece.charAt(0) === 'p' && moveType === 'capture') {
        notationPiece = moveSquareFromRowCol(oldRow, oldCol).charAt(0);
    }

    if (moveType === 'capture') {
        notationCapture = 'x';
    }

    notationToSquare = moveSquareFromRowCol(toRow, toCol);

    if (newState[nextPlayer + 'InCheck'] === true) {
        notationCheck = '+';

        if (newState.gameOver === true && newState.outcome === 'checkmate') {
            notationCheck = '#';
        }
    }

    notation = notationPiece + notationCapture + notationToSquare + notationCheck;

    return {
        ...newState,
        moveNotation: notation
    }
}

export const  constructStatePostPromotionChoice = (state, newPiece, row, col) => {
    let newBoardState = cloneDeep(state.boardPositions);
    let currentPlayer = state.currentPlayer;
    let pieceColor = (currentPlayer === 'white') ? 'w' : 'b';
    let nextPlayer = (currentPlayer === 'white') ? 'black' : 'white';
    let oldRow = state.activePiece.row;
    let oldCol = state.activePiece.col;
    let newState = {};
    let notation = '';
    let notationPiece = '';
    let notationCapture = '';
    let notationToSquare = '';
    let notationPromotion = '=' + newPiece.toUpperCase();
    let notationCheck = '';
    
    newBoardState[row][col] = newPiece + pieceColor;

    newState = {
        ...state,
        boardPositions: newBoardState, 
        displayPromotionOptions: false,
        promoteColumn: -1,
        activePiece: {}, 
        validMoveSquares: [],
        currentPlayer: nextPlayer
    }

    newState =  determineStateForNextPlayer(newState, currentPlayer, nextPlayer, newBoardState);

    notationPiece = moveSquareFromRowCol(oldRow, oldCol).charAt(0);
    notationToSquare = moveSquareFromRowCol(row, col);

    if (notationPiece.charAt(0) === notationToSquare.charAt(0)) {
        notationPiece = '';
    }
    else {
        notationCapture = 'x';
    }
    
    if (newState[nextPlayer + 'InCheck'] === true) {
        notationCheck = '+';

        if (newState.gameOver === true && newState.outcome === 'checkmate') {
            notationCheck = '#';
        }
    }

    notation = notationPiece + notationCapture + notationToSquare + notationPromotion + notationCheck;

    return {
        ...newState,
        moveNotation: notation
    }
}

export const moveSquareFromRowCol = (toRow, toCol) => {
    let colMap = 'abcdefgh';
    let rowMap = '12345678';

    return colMap.charAt(toCol) + rowMap.charAt(toRow);
}

export const constructNotationPairArr = (notationArr) => {
    let movePairArr = [];

    for (let idx = 0; idx < notationArr.length; idx+=2) {
        movePairArr.push(notationArr.slice(idx, idx+2));
    }

    return movePairArr;
}