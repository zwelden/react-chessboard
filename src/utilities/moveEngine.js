export const determineValidPieceMoves = (gameState, boardState, row, col) => {
    let pieceToMove = boardState[row][col];
    let pieceType = '';
    let pieceColor = '';
    let kingPosition = {row: -1, col: -1};
    
    if (pieceToMove.length < 2) {
        return [];
    }

    pieceType = pieceToMove.charAt(0);
    pieceColor = pieceToMove.charAt(1);
    kingPosition = getKingPosition(pieceColor, boardState);

    let validMoves = [];


    switch (pieceType) {
        case 'p':
            validMoves = validPawnMoves(gameState, pieceColor, boardState, kingPosition, row, col);
            break;
        
        case 'n':
            validMoves = validKnightMoves(pieceColor, boardState, kingPosition, row, col);
            break;

        case 'b':
            validMoves = validBishopMoves(pieceColor, boardState, kingPosition, row, col);
            break;
    
        case 'r':
            validMoves = validRookMoves(pieceColor, boardState, kingPosition, row, col);
            break;

        case 'q':
            validMoves = validQueenMoves(pieceColor, boardState, kingPosition, row, col);
            break;

        case 'k':
            validMoves = validKingMoves(gameState, pieceColor, boardState, row, col);
            break;
        
        
        default:
            break;
    }

    return validMoves;
}


const validPawnMoves = (gameState, pieceColor, boardState, kingPosition, row, col) => {
    let validMoves = [];
    let forwardMoves = [];
    let attackMoves = [];
    let enPassantMoves = [];
    let enPassantTarget = (pieceColor === 'w') ? 'black' : 'white';
    let enPassantablePawn = gameState[enPassantTarget].enPassantablePawn;
    let enPassRowAdjust = (pieceColor === 'w') ? -1 : 1;
    

    if (pieceColor === 'w') {
        forwardMoves = [{r: row + 1, c: col}];
        attackMoves = [{r: row + 1, c: col + 1}, {r: row + 1, c: col - 1}];
        enPassantMoves = [{r: row + 1, c: col + 1}, {r: row + 1, c: col - 1}];

        if (row === 1 && boardState[row + 1][col] === '') {
            forwardMoves.push({r: row + 2, c: col})
        }
    } 
    else {
        forwardMoves = [{r: row - 1, c: col}];
        attackMoves = [{r: row - 1, c: col + 1}, {r: row - 1, c: col - 1}];
        enPassantMoves = [{r: row - 1, c: col + 1}, {r: row - 1, c: col - 1}];

        if (row === 6 && boardState[row - 1][col] === '') {
            forwardMoves.push({r: row - 2, c: col})
        }
    } 

    forwardMoves.forEach(move => {
        if (move.r < 0 || move.r > 7 || move.c < 0 || move.c > 7) {
            return;
        }

        let square = boardState[move.r][move.c];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        let inCheck = false;
        newBoardState[row][col] = '';
        newBoardState[move.r][move.c] = 'p' + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);
        
        if (inCheck) {
            return false;
        }

        if (square === '') {
            validMoves.push({row: move.r, col: move.c, type: 'move'});
        }
    });

    attackMoves.forEach(move => {
        if (move.r < 0 || move.r > 7 || move.c < 0 || move.c > 7) {
            return;
        }

        let square = boardState[move.r][move.c];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        let inCheck = false;
        newBoardState[row][col] = '';
        newBoardState[move.r][move.c] = 'p' + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);
        
        if (inCheck) {
            return false;
        }

        if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: move.r, col: move.c, type: 'capture'});
        }
    });

    if (enPassantablePawn.hasOwnProperty('row') && enPassantablePawn.hasOwnProperty('col')) {
        enPassantMoves.forEach(move => {
            if (move.r < 0 || move.r > 7 || move.c < 0 || move.c > 7) {
                return;
            }
    
            let enPassPawnRow = enPassantablePawn.row;
            let enPassPawnCol = enPassantablePawn.col;
            let newBoardState = JSON.parse(JSON.stringify(boardState));
            let inCheck = false;

            if (move.r + enPassRowAdjust !== enPassPawnRow || move.c !== enPassPawnCol) {
                return;
            }

            newBoardState[row][col] = '';
            newBoardState[move.r][move.c] = 'p' + pieceColor.charAt(0);
    
            inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);
            
            if (inCheck) {
                return false;
            }
    
            validMoves.push({row: move.r, col: move.c, type: 'capture', subType: 'enPassant'});
        })
    }

    

    return validMoves;
}


const validKnightMoves = (pieceColor, boardState, kingPosition, row, col) => {
    let validMoves = [];
    let possibleMoves = [
        {r: row + 1, c: col + 2}, 
        {r: row + 1, c: col - 2}, 
        {r: row - 1, c: col + 2}, 
        {r: row - 1, c: col - 2}, 
        {r: row + 2, c: col + 1}, 
        {r: row + 2, c: col - 1}, 
        {r: row - 2, c: col + 1}, 
        {r: row - 2, c: col - 1}, 
    ];

    possibleMoves.forEach(move => {
        if (move.r < 0 || move.r > 7 || move.c < 0 || move.c > 7) {
            return;
        }
        
        let square = boardState[move.r][move.c];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        let inCheck = false;
        newBoardState[row][col] = '';
        newBoardState[move.r][move.c] = 'n' + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);
        
        if (inCheck) {
            return false;
        }

        if (square === '') {
            validMoves.push({row: move.r, col: move.c, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: move.r, col: move.c, type: 'capture'});
        }
    });

    return validMoves;
}


const validBishopMoves = (pieceColor, boardState, kingPosition, row, col) => {
    return validDiagonalMoves('b', pieceColor, boardState, kingPosition, row, col);
}


const validRookMoves = (pieceColor, boardState, kingPosition, row, col) => {
    return validHorizontalVerticalMoves('r', pieceColor, boardState, kingPosition, row, col);
}


const validQueenMoves = (pieceColor, boardState, kingPosition, row, col) => {
    let diagonalMoves = validDiagonalMoves('q', pieceColor, boardState, kingPosition, row, col);
    let horizontalMoves = validHorizontalVerticalMoves('q', pieceColor, boardState, kingPosition, row, col);

    return diagonalMoves.concat(horizontalMoves);
}


const validKingMoves = (gameState, pieceColor, boardState, row, col) => {
    let validMoves = [];
    let possibleMoves = [
        {r: row + 1, c: col + 1}, 
        {r: row, c: col + 1}, 
        {r: row - 1, c: col + 1}, 
        {r: row - 1, c: col}, 
        {r: row - 1, c: col - 1}, 
        {r: row, c: col - 1}, 
        {r: row + 1, c: col - 1}, 
        {r: row + 1, c: col}, 
    ];

    let sideColor = (pieceColor === 'w') ? 'white' : 'black';

    possibleMoves.forEach(move => {
        if (move.r < 0 || move.r > 7 || move.c < 0 || move.c > 7) {
            return;
        }
        
        let square = boardState[move.r][move.c];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        let inCheck = false;
        newBoardState[row][col] = '';
        newBoardState[move.r][move.c] = 'k' + pieceColor.charAt(0);

        inCheck = isKingInCheck({row: move.r, col: move.c}, pieceColor, newBoardState);
        
        if (inCheck) {
            return false;
        }

        if (square === '') {
            validMoves.push({row: move.r, col: move.c, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: move.r, col: move.c, type: 'capture'});
        }
    });

    if (gameState[sideColor].inCheck === false && gameState[sideColor].kingMoved === false) {
        let canCastle = false;

        if (gameState[sideColor].kingsRookMoved === false) {
            canCastle = canCastleKingSide(pieceColor, boardState);

            if (canCastle) {
                validMoves.push({row: row, col: 6, type: 'move', subType: 'castleKingSide'});
            }
        }
        
        if (gameState[sideColor].queensRookMoved === false) {
            canCastle = canCastleQueenSide(pieceColor, boardState);

            if (canCastle) {
                validMoves.push({row: row, col: 2, type: 'move', subType: 'castleQueenSide'});
            }
        }
    }

    return validMoves;
}

const canCastleKingSide = (kingColor, boardState) => {
    let row = (kingColor === 'w') ? 0 : 7;
    let bishopSquare = boardState[row][5];
    let knightSquare = boardState[row][6];
    let inCheckAtBishopSquare = false;
    let inCheckAtKnightSquare = false;
    let inCheckAfterCastle = false;
    let newBoardStateAtBishopSquare = {}
    let newBoardStateAtKnightSquare = {};
    let newBoardStateAtKnightSquare2 = {};

    if (bishopSquare !== '' || knightSquare !== '') {
        return false;
    }

    newBoardStateAtBishopSquare = JSON.parse(JSON.stringify(boardState));  
    newBoardStateAtBishopSquare[row][4] = '';
    newBoardStateAtBishopSquare[row][5] = 'k' + kingColor;
    inCheckAtBishopSquare = isKingInCheck({row: row, col: 5}, kingColor, newBoardStateAtBishopSquare);

    if (inCheckAtBishopSquare === true) {
        return false;
    }

    newBoardStateAtKnightSquare = JSON.parse(JSON.stringify(boardState));  
    newBoardStateAtKnightSquare[row][4] = '';
    newBoardStateAtKnightSquare[row][6] = 'k' + kingColor;
    inCheckAtKnightSquare = isKingInCheck({row: row, col: 6}, kingColor, newBoardStateAtKnightSquare);

    if (inCheckAtKnightSquare === true) {
        return false;
    }

    newBoardStateAtKnightSquare2 = JSON.parse(JSON.stringify(boardState));  
    newBoardStateAtKnightSquare2[row][4] = '';
    newBoardStateAtKnightSquare2[row][6] = 'k' + kingColor;
    newBoardStateAtKnightSquare2[row][5] = 'r' + kingColor;
    newBoardStateAtKnightSquare2[row][7] = '';
    inCheckAfterCastle = isKingInCheck({row: row, col: 6}, kingColor, newBoardStateAtKnightSquare2);

    return !inCheckAfterCastle;
}


const canCastleQueenSide = (kingColor, boardState) => {
    let row = (kingColor === 'w') ? 0 : 7;
    let queenSquare = boardState[row][3];
    let bishopSquare = boardState[row][2];
    let knightSquare = boardState[row][1];
    let inCheckAtQueenSquare = false;
    let inCheckAtBishopSquare = false;
    let inCheckAfterCastle = false;
    let newBoardStateAtQueenSquare = {};  
    let newBoardStateAtBishopSquare = {};  
    let newBoardStateAtBishopSquare2 = {};  

    if (queenSquare !== '' || bishopSquare !== '' || knightSquare !== '') {
        return false;
    }

    newBoardStateAtQueenSquare = JSON.parse(JSON.stringify(boardState));  
    newBoardStateAtQueenSquare[row][4] = '';
    newBoardStateAtQueenSquare[row][3] = 'k' + kingColor;
    inCheckAtQueenSquare = isKingInCheck({row: row, col: 5}, kingColor, newBoardStateAtQueenSquare);

    if (inCheckAtQueenSquare === true) {
        return false;
    }

    newBoardStateAtBishopSquare = JSON.parse(JSON.stringify(boardState));  
    newBoardStateAtBishopSquare[row][4] = '';
    newBoardStateAtBishopSquare[row][2] = 'k' + kingColor;
    inCheckAtBishopSquare = isKingInCheck({row: row, col: 6}, kingColor, newBoardStateAtBishopSquare);

    if (inCheckAtBishopSquare === true) {
        return false;
    }

    newBoardStateAtBishopSquare2 = JSON.parse(JSON.stringify(boardState));  
    newBoardStateAtBishopSquare2[row][4] = '';
    newBoardStateAtBishopSquare2[row][2] = 'k' + kingColor;
    newBoardStateAtBishopSquare2[row][3] = 'r' + kingColor;
    newBoardStateAtBishopSquare2[row][0] = '';
    inCheckAfterCastle = isKingInCheck({row: row, col: 6}, kingColor, newBoardStateAtBishopSquare2);

    return !inCheckAfterCastle;
}


const validDiagonalMoves = (pieceType, pieceColor, boardState, kingPosition, row, col) => {
    let validMoves = [];

    validDirectionalMoves(boardState, kingPosition, pieceType, pieceColor, row, col, 1, 1).forEach(move => {
        validMoves.push(move);
    });

    validDirectionalMoves(boardState, kingPosition, pieceType, pieceColor, row, col, 1, -1).forEach(move => {
        validMoves.push(move);
    });

    validDirectionalMoves(boardState, kingPosition, pieceType, pieceColor, row, col, -1, 1).forEach(move => {
        validMoves.push(move);
    });

    validDirectionalMoves(boardState, kingPosition, pieceType, pieceColor, row, col, -1, -1).forEach(move => {
        validMoves.push(move);
    });

    return validMoves;
}


const validHorizontalVerticalMoves = (pieceType, pieceColor, boardState, kingPosition, row, col) => {

    let validMoves = [];

    validDirectionalMoves(boardState, kingPosition, pieceType, pieceColor, row, col, 0, 1).forEach(move => {
        validMoves.push(move);
    });

    validDirectionalMoves(boardState, kingPosition, pieceType, pieceColor, row, col, 0, -1).forEach(move => {
        validMoves.push(move);
    });

    validDirectionalMoves(boardState, kingPosition, pieceType, pieceColor, row, col, 1, 0).forEach(move => {
        validMoves.push(move);
    });

    validDirectionalMoves(boardState, kingPosition, pieceType, pieceColor, row, col, -1, 0).forEach(move => {
        validMoves.push(move);
    });

    return validMoves;
}

const validDirectionalMoves = (boardState, kingPosition, pieceType, pieceColor, row, col, xIter, yIter) => {
    const startPosition = {row: row, col: col};
    let validMoves = [];
    let maxMove = false;
    let moveValid = false;
    let moveDetail = {};
    let x = col + xIter;
    let y = row + yIter;

    while (maxMove === false && x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        let movePosition = {row: y, col: x};

        ({moveValid, maxMove, moveDetail} = evaluateMove(boardState, kingPosition, pieceType, pieceColor, startPosition, movePosition));

        if (moveValid) {
            validMoves.push(moveDetail);
        }

        x += xIter;
        y += yIter;
    }

    return validMoves;
}


const evaluateMove = (boardState, kingPosition, pieceType, pieceColor, startPosition, movePosition) => {
    let startRow = startPosition.row;
    let startCol = startPosition.col;
    let x = movePosition.col;
    let y = movePosition.row;
    let square = boardState[y][x];
    let newBoardState = JSON.parse(JSON.stringify(boardState));
    let inCheck = false;
    let moveValid = false;
    let maxMove = false;
    let moveDetail = {};

    if (x === kingPosition.col && y === kingPosition.row) {
        return {moveValid: false, maxMove: true, moveDetail: {}};
    }

    newBoardState[startRow][startCol] = '';
    newBoardState[y][x] = pieceType + pieceColor.charAt(0);

    inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);

    if (!inCheck && square === '') {
        moveValid = true;
        moveDetail = {row: y, col: x, type: 'move'};
    }
    else if (!inCheck && square !== '' && square.charAt(1) !== pieceColor) {
        moveValid = true;
        maxMove = true;

        moveDetail = {row: y, col: x, type: 'capture'};
    }
    else if (!inCheck && square !== '' && square.charAt(1) === pieceColor) {
        maxMove = true;
    }

    return {moveValid: moveValid, maxMove: maxMove, moveDetail: moveDetail};
}

export const getKingPosition = (pieceColor, boardState) => {
    let row = -1;
    let col = -1;
    let targetPiece = 'k' + pieceColor;

    boardState.some((current_row, row_index) => {
        return current_row.some((current_col, col_index) => {
            let kingFound = (current_col === targetPiece);

            if (kingFound === true) {
                row = row_index;
                col = col_index;
            }

            return kingFound;
        });
    });

    return {row: row, col: col};
}


export const isKingInCheck = (kingPosition, kingColor, boardState) => {
    let row = kingPosition.row;
    let col = kingPosition.col;
    let opponentColor = (kingColor === 'w') ? 'b' : 'w';
    let inCheck = false;

    let checkingKnightPositions = [
        {r: row + 1, c: col + 2}, 
        {r: row + 1, c: col - 2}, 
        {r: row - 1, c: col + 2}, 
        {r: row - 1, c: col - 2}, 
        {r: row + 2, c: col + 1}, 
        {r: row + 2, c: col - 1}, 
        {r: row - 2, c: col + 1}, 
        {r: row - 2, c: col - 1}, 
    ];

    let checkingWhitePawnPositions = [
        {r: row - 1, c: col + 1},
        {r: row - 1, c: col - 1}
    ];

    let checkingBlackPawnPositions = [
        {r: row + 1, c: col + 1},
        {r: row + 1, c: col - 1} 
    ];

    let checkingPawnPositions = (kingColor === 'w') 
                                ? checkingBlackPawnPositions 
                                : checkingWhitePawnPositions;
            
    let bishop = 'b' + opponentColor;
    let rook = 'r' + opponentColor;
    let queen = 'q' + opponentColor;
    let checkablePieces = [];

    // check knights
    inCheck = checkingKnightPositions.some(coords => {
        if (coords.r > 7 || coords.r < 0 || coords.c > 7 || coords.c < 0) {
            return false;
        }

        let square = boardState[coords.r][coords.c];
        return (square === 'n' + opponentColor);
    });

    if (inCheck === true) {
        return true;
    }

    // check attacking pawns
    inCheck = checkingPawnPositions.some(coords => {
        if (coords.r > 7 || coords.r < 0 || coords.c > 7 || coords.c < 0) {
            return false;
        }

        let square = boardState[coords.r][coords.c];
        return (square === 'p' + opponentColor);
    });

    if (inCheck === true) {
        return true;
    }

    // check diagonals
    checkablePieces = [bishop, queen];

    inCheck = evaluateKingCheckByDirection(boardState, checkablePieces, row, col, 1, 1);
    if (inCheck === true) {
        return true;
    }

    inCheck = evaluateKingCheckByDirection(boardState, checkablePieces, row, col, 1, -1);
    if (inCheck === true) {
        return true;
    }

    inCheck = evaluateKingCheckByDirection(boardState, checkablePieces, row, col, -1, 1);
    if (inCheck === true) {
        return true;
    }

    inCheck = evaluateKingCheckByDirection(boardState, checkablePieces, row, col, -1, -1);
    if (inCheck === true) {
        return true;
    }
     
    // check horizontals
    checkablePieces = [rook, queen];

    inCheck = evaluateKingCheckByDirection(boardState, checkablePieces, row, col, 0, 1);
    if (inCheck === true) {
        return true;
    }

    inCheck = evaluateKingCheckByDirection(boardState, checkablePieces, row, col, 0, -1);
    if (inCheck === true) {
        return true;
    }

    inCheck = evaluateKingCheckByDirection(boardState, checkablePieces, row, col, 1, 0);
    if (inCheck === true) {
        return true;
    }

    inCheck = evaluateKingCheckByDirection(boardState, checkablePieces, row, col, -1, 0);

    return inCheck;
}

const evaluateKingCheckByDirection = (boardState, checkablePieces, row, col, xIter, yIter) => {
    let maxLookUp = false;
    let inCheck = false;
    let x = col + xIter;
    let y = row + yIter;
 
    while (maxLookUp === false && inCheck === false && x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        let square = boardState[y][x];

        if (checkablePieces.includes(square)) {
            maxLookUp = true;
            inCheck = true;
        }
        else if (square !== '') {
            maxLookUp = true;
        }

        x += xIter;
        y += yIter;
    }

   return inCheck;
}

