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
            return {
                ...state, 
                validMoveSquares: action.payload.validMoveSquares,
                activePiece: action.payload.activePiece
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
            
            return {
                ...state,
                boardPositions: payload.boardPositions, 
                displayPromotionOptions: payload.displayPromotionOptions,
                promoteColumn: payload.promoteColumn,
                activePiece: {}, 
                lastMoveStart: payload.lastMoveStart,
                lastMoveEnd: payload.lastMoveEnd,
                validMoveSquares: [],
                currentPlayer: payload.currentPlayer,
                enPassantablePawn: payload.enPassantablePawn,
                whiteInCheck: false,
                blackInCheck: false
            }

        case 'updateStatePostPromotion':
            payload = action.payload;

            return {
                ...state,
                boardPositions: payload.boardPositions, 
                displayPromotionOptions: false,
                promoteColumn: -1,
                activePiece: {}, 
                validMoveSquares: [],
                currentPlayer: payload.currentPlayer
            }

        case 'restartGame':
            return initialState;
        
        default:
            throw new Error();
        }
}