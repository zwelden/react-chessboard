import { determineValidPieceMoves } from "./moveEngine";
import { 
    getGameState, 
    constructStatePostMoveChoice, 
    constructStatePostPromotionChoice } from "./helpers";

export const initialState = {
    currentMove: 0,
    canMakeMoves: true,
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
    blackQueensRookMoved: false,
    notationHistory: [],
    boardHistory: []
}


export const reducer = (state, action) => {
    let payload;

    switch (action.type) {
        case 'setData':
            return {...state, [action.field]: action.payload};

        case 'flipBoardOrientation':
            let newBoardOrientation = (state.boardOrientation === 'white') ? 'black' : 'white';
            return {...state, boardOrientation: newBoardOrientation};

        case 'updateValidMoveSquares':
            let validMoves = [];
            let selectedSquare = state.boardPositions[action.payload.row][action.payload.col];
            
            if (selectedSquare.charAt(1) !== state.currentPlayer.charAt(0)) {
                return state;
            }

            validMoves = determineValidPieceMoves(
                getGameState(state), 
                state.boardPositions, 
                action.payload.row, 
                action.payload.col
            );

            return {
                ...state, 
                validMoveSquares: validMoves,
                activePiece: {row: action.payload.row, col: action.payload.col}
            }

        case 'clearValidMoveSquares':
            return {...state, validMoveSquares: [], activePiece: {}};
        
        case 'updatePlayerInCheck':
            let whiteInCheck = (action.payload === 'white');
            let blackInCheck = (action.payload === 'black');

            return {
                ...state,
                whiteInCheck: whiteInCheck,
                blackInCheck: blackInCheck
            }

        case 'endGame':
            return {
                ...state,
                gameOver: true,
                outcome: action.payload.endType,
                winner: (action.payload.endType === 'checkmate') ? action.payload.winner : '',
            }
        
        case 'updateStatePostMove':
            payload = action.payload;

            let postMoveState = constructStatePostMoveChoice(state, payload.toRow, payload.toCol, payload.moveType, payload.moveSubType);
            
            if (postMoveState.displayPromotionOptions === true) {
                return postMoveState;
            }

            postMoveState = {
                ...postMoveState,
                currentMove: postMoveState.currentMove + 1,
                notationHistory: state.notationHistory.concat(postMoveState.moveNotation),
                boardHistory: postMoveState.boardHistory.concat({
                    currentMove: postMoveState.currentMove + 1,
                    currentPlayer: postMoveState.currentPlayer,
                    lastMoveStart:  postMoveState.lastMoveStart,
                    lastMoveEnd: postMoveState.lastMoveEnd,
                    boardPositions: [...postMoveState.boardPositions],
                    enPassantablePawn: postMoveState.enPassantablePawn,
                    whiteInCheck: postMoveState.whiteInCheck,
                    blackInCheck: postMoveState.blackInCheck,
                    whiteKingMoved: postMoveState.whiteKingMoved,
                    blackKingMoved: postMoveState.blackKingMoved,
                    whiteKingsRookMoved: postMoveState.whiteKingsRookMoved,
                    blackKingsRookMoved: postMoveState.blackKingsRookMoved,
                    whiteQueensRookMoved: postMoveState.whiteQueensRookMoved,
                    blackQueensRookMoved: postMoveState.blackQueensRookMoved
                })
            }

            return postMoveState;

        case 'updateStatePostPromotion':
            payload = action.payload;
            let postPromotionState =  constructStatePostPromotionChoice(state, payload.newPiece, payload.row, payload.col);

            postPromotionState = {
                ...postPromotionState,
                currentMove: postPromotionState.currentMove + 1,
                notationHistory: state.notationHistory.concat(postPromotionState.moveNotation),
                boardHistory: postPromotionState.boardHistory.concat({
                    currentMove: postPromotionState.currentMove  + 1,
                    currentPlayer: postPromotionState.currentPlayer,
                    lastMoveStart:  postPromotionState.lastMoveStart,
                    lastMoveEnd: postPromotionState.lastMoveEnd,
                    boardPositions: [...postPromotionState.boardPositions],
                    enPassantablePawn: postPromotionState.enPassantablePawn,
                    whiteInCheck: postPromotionState.whiteInCheck,
                    blackInCheck: postPromotionState.blackInCheck,
                    whiteKingMoved: postPromotionState.whiteKingMoved,
                    blackKingMoved: postPromotionState.blackKingMoved,
                    whiteKingsRookMoved: postPromotionState.whiteKingsRookMoved,
                    blackKingsRookMoved: postPromotionState.blackKingsRookMoved,
                    whiteQueensRookMoved: postPromotionState.whiteQueensRookMoved,
                    blackQueensRookMoved: postPromotionState.blackQueensRookMoved
                })
            }

            return postPromotionState;

        case 'goToTurn':
            let currentMove = state.currentMove;
            let historyLen = state.boardHistory.length;
            let turnTarget = action.payload;
            let canMakeMoves = false;
            let targetMoveIdx = 0;
            let historyDirection = '';

            switch (turnTarget) {
                case 'first':
                    historyDirection = 'back';
                    targetMoveIdx = 0;
                    break;

                case 'prev':
                    historyDirection = 'back';
                    targetMoveIdx = currentMove - 2;
                    break;

                case 'next':
                    historyDirection = 'forward';
                    targetMoveIdx = currentMove;
                    break;

                case 'last':
                    historyDirection = 'forward';
                    targetMoveIdx = historyLen - 1;
                    break;

                default:
                    break;
            }

            if (historyDirection === 'back' && currentMove <= 1 && targetMoveIdx <= 0) { 
                return {
                    ...state,
                    canMakeMoves: canMakeMoves,
                    currentPlayer: initialState.currentPlayer,
                    currentMove:  initialState.currentMove,
                    lastMoveStart:  initialState.lastMoveStart,
                    lastMoveEnd: initialState.lastMoveEnd,
                    boardPositions: [...initialState.boardPositions],
                    enPassantablePawn: initialState.enPassantablePawn,
                    whiteInCheck: initialState.whiteInCheck,
                    blackInCheck: initialState.blackInCheck,
                    whiteKingMoved: initialState.whiteKingMoved,
                    blackKingMoved: initialState.blackKingMoved,
                    whiteKingsRookMoved: initialState.whiteKingsRookMoved,
                    blackKingsRookMoved: initialState.blackKingsRookMoved,
                    whiteQueensRookMoved: initialState.whiteQueensRookMoved,
                    blackQueensRookMoved: initialState.blackQueensRookMoved
                }
            }
            if (targetMoveIdx >= historyLen && historyLen > 0) {
                targetMoveIdx = historyLen - 1;
            }
            if (targetMoveIdx >= historyLen && historyLen === 0) {
                return state;
            }

            if (targetMoveIdx === historyLen - 1) {
                canMakeMoves = true;
            }


            let targetState = state.boardHistory[targetMoveIdx];

            return {
                ...state,
                canMakeMoves: canMakeMoves,
                currentPlayer: targetState.currentPlayer,
                    currentMove:  targetState.currentMove,
                    lastMoveStart:  targetState.lastMoveStart,
                    lastMoveEnd: targetState.lastMoveEnd,
                    boardPositions: [...targetState.boardPositions],
                    enPassantablePawn: targetState.enPassantablePawn,
                    whiteInCheck: targetState.whiteInCheck,
                    blackInCheck: targetState.blackInCheck,
                    whiteKingMoved: targetState.whiteKingMoved,
                    blackKingMoved: targetState.blackKingMoved,
                    whiteKingsRookMoved: targetState.whiteKingsRookMoved,
                    blackKingsRookMoved: targetState.blackKingsRookMoved,
                    whiteQueensRookMoved: targetState.whiteQueensRookMoved,
                    blackQueensRookMoved: targetState.blackQueensRookMoved
            }


        case 'restartGame':
            return initialState;
        
        default:
            throw new Error();
        }
}