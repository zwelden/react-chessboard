import { determineValidPieceMoves } from "./moveEngine";
import { 
    getGameState, 
    constructStatePostMoveChoice, 
    constructStatePostPromotionChoice } from "./helpers";

export const initialState = {
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
            return constructStatePostMoveChoice(state, payload.toRow, payload.toCol, payload.moveType, payload.moveSubType);

        case 'updateStatePostPromotion':
            payload = action.payload;
            return constructStatePostPromotionChoice(state, payload.newPiece, payload.row, payload.col);

        case 'restartGame':
            return initialState;
        
        default:
            throw new Error();
        }
}