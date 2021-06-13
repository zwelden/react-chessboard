import { isCompositeComponent } from "react-dom/test-utils";

export const determineValidPieceMoves = (boardState, row, col) => {
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
            validMoves = validPawnMoves(pieceColor, boardState, kingPosition, row, col);
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
            validMoves = validKingMoves(pieceColor, boardState, kingPosition, row, col);
            break;
        
        
        default:
            break;
    }

    return validMoves;
}


const validPawnMoves = (pieceColor, boardState, kingPosition, row, col) => {
    let validMoves = [];
    let forwardMoves = [];
    let attackMoves = [];

    if (pieceColor === 'w') {
        forwardMoves = [{r: row + 1, c: col}];
        attackMoves = [{r: row + 1, c: col + 1}, {r: row + 1, c: col - 1}];

        if (row === 1 && boardState[row + 1][col] === '') {
            forwardMoves.push({r: row + 2, c: col})
        }
    } 
    else {
        forwardMoves = [{r: row - 1, c: col}];
        attackMoves = [{r: row - 1, c: col + 1}, {r: row - 1, c: col - 1}];

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


const validKingMoves = (pieceColor, boardState, kingPosition, row, col) => {
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

    return validMoves;
}


const validDiagonalMoves = (pieceType, pieceColor, boardState, kingPosition, row, col) => {
    let validMoves = [];
    let maxMove = false;
    let inCheck = false;
    let x = col + 1;
    let y = row + 1;

    while (maxMove === false && x <= 7 && y <= 7) {
        let square = boardState[y][x];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        newBoardState[row][col] = '';
        newBoardState[y][x] = pieceType + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);
        console.log(inCheck);

        if (!inCheck && square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (!inCheck && square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else if (!inCheck && square !== '' && square.charAt(1) === pieceColor) {
            maxMove = true;
        }

        x++;
        y++;
    }

    maxMove = false;
    inCheck = false;
    x = col + 1;
    y = row - 1;
    while (maxMove === false && x <= 7 && y >= 0) {
        let square = boardState[y][x];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        newBoardState[row][col] = '';
        newBoardState[y][x] = pieceType + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);

        if (!inCheck && square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (!inCheck && square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else if (!inCheck && square !== '' && square.charAt(1) === pieceColor) {
            maxMove = true;
        }

        x++;
        y--;
    }

    maxMove = false;
    inCheck = false;
    x = col - 1;
    y = row + 1;
    while (maxMove === false && x >= 0 && y <= 7) {
        let square = boardState[y][x];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        newBoardState[row][col] = '';
        newBoardState[y][x] = pieceType + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);

        if (!inCheck && square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (!inCheck && square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else if (!inCheck && square !== '' && square.charAt(1) === pieceColor) {
            maxMove = true;
        }

        x--;
        y++;
    }

    maxMove = false;
    inCheck = false;
    x = col - 1;
    y = row - 1;
    while (maxMove === false && x >= 0 && y >= 0) {
        let square = boardState[y][x];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        newBoardState[row][col] = '';
        newBoardState[y][x] = pieceType + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);

        if (!inCheck && square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (!inCheck && square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else if (!inCheck && square !== '' && square.charAt(1) === pieceColor) {
            maxMove = true;
        }

        x--;
        y--;
    }


    return validMoves;
}


const validHorizontalVerticalMoves = (pieceType, pieceColor, boardState, kingPosition, row, col) => {
    let validMoves = [];
    let maxMove = false;
    let inCheck = false;
    let x = col;
    let y = row + 1;

    while (maxMove === false && y <= 7) {
        let square = boardState[y][x];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        newBoardState[row][col] = '';
        newBoardState[y][x] = pieceType + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);

        if (!inCheck && square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (!inCheck && square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else if (!inCheck && square !== '' && square.charAt(1) === pieceColor) {
            maxMove = true;
        }

        y++;
    }

    maxMove = false;
    inCheck = false;
    x = col;
    y = row - 1;
    while (maxMove === false && y >= 0) {
        let square = boardState[y][x];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        newBoardState[row][col] = '';
        newBoardState[y][x] = pieceType + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);

        if (!inCheck && square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (!inCheck && square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else if (!inCheck && square !== '' && square.charAt(1) === pieceColor) {
            maxMove = true;
        }

        y--;
    }

    maxMove = false;
    inCheck = false;
    x = col + 1;
    y = row;
    while (maxMove === false && x <= 7) {
        let square = boardState[y][x];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        newBoardState[row][col] = '';
        newBoardState[y][x] = pieceType + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);

        if (!inCheck && square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (!inCheck && square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else if (!inCheck && square !== '' && square.charAt(1) === pieceColor) {
            maxMove = true;
        }

        x++;
    }

    maxMove = false;
    inCheck = false;
    x = col - 1;
    y = row;
    while (maxMove === false && x >= 0) {
        let square = boardState[y][x];
        let newBoardState = JSON.parse(JSON.stringify(boardState));
        newBoardState[row][col] = '';
        newBoardState[y][x] = pieceType + pieceColor.charAt(0);

        inCheck = isKingInCheck(kingPosition, pieceColor, newBoardState);

        if (!inCheck && square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (!inCheck && square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else if (!inCheck && square !== '' && square.charAt(1) === pieceColor) {
            maxMove = true;
        }

        x--;
    }

    return validMoves;
}

const isMoveValid = () => {
    return false;
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

    // check knights
    inCheck = checkingKnightPositions.some(coords => {
        if (coords.r > 7 || coords.r < 0 || coords.c > 7 || coords.c < 0) {
            return false;
        }

        let square = boardState[coords.r][coords.c];
        return (square === 'n' + opponentColor);
    });

    if (inCheck === true) {
        console.log('#1');
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
        console.log('#2');
        return true;
    }

    // check diagonals
    let maxLookUp = false;
    let x = col + 1;
    let y = row + 1;
    let bishop = 'b' + opponentColor;
    let rook = 'r' + opponentColor;
    let queen = 'q' + opponentColor;
 
    while (maxLookUp === false && inCheck === false && x <= 7 && y <= 7) {
        let square = boardState[y][x];

        if (square === bishop || square === queen) {
            maxLookUp = true;
            inCheck = true;
        }
        else if (square !== '') {
            maxLookUp = true;
        }

        x++;
        y++;
    }

    if (inCheck === true) {
        console.log('#3');
        return true;
    }

    maxLookUp = false;
    x = col + 1;
    y = row - 1;
    while (maxLookUp === false && inCheck === false && x <= 7 && y >= 0) {
        let square = boardState[y][x];

        if (square === bishop || square === queen) {
            maxLookUp = true;
            inCheck = true;
        }
        else if (square !== '') {
            maxLookUp = true;
        }

        x++;
        y--;
    }

    if (inCheck === true) {
        console.log('#4');
        return true;
    }

    maxLookUp = false;
    x = col - 1;
    y = row + 1;
    while (maxLookUp === false && inCheck === false && x >= 0 && y <= 7) {
        let square = boardState[y][x];

        if (square === bishop || square === queen) {
            maxLookUp = true;
            inCheck = true;
        }
        else if (square !== '') {
            maxLookUp = true;
        }

        x--;
        y++;
    }

    if (inCheck === true) {
        console.log('#5');
        return true;
    }

    maxLookUp = false;
    x = col - 1;
    y = row - 1;
    while (maxLookUp === false && inCheck === false && x >= 0 && y >= 0) {
        let square = boardState[y][x];

        if (square === bishop || square === queen) {
            maxLookUp = true;
            inCheck = true;
        }
        else if (square !== '') {
            maxLookUp = true;
        }

        x--;
        y--;
    }

    if (inCheck === true) {
        console.log('#6');
        return true;
    }

    
    // check horizontals
    maxLookUp = false;
    x = col + 1;
    y = row;
    while (maxLookUp === false && inCheck === false && x <= 7) {
        let square = boardState[y][x];

        if (square === rook || square === queen) {
            maxLookUp = true;
            inCheck = true;
        }
        else if (square !== '') {
            maxLookUp = true;
        }

        x++;
    }

    if (inCheck === true) {
        console.log('#7');
        return true;
    }

    maxLookUp = false;
    x = col - 1;
    y = row;
    while (maxLookUp === false && inCheck === false && x >= 0) {
        let square = boardState[y][x];

        if (square === rook || square === queen) {
            maxLookUp = true;
            inCheck = true;
        }
        else if (square !== '') {
            maxLookUp = true;
        }

        x--;
    }

    if (inCheck === true) {
        console.log('#8');
        return true;
    }

    // check verticals
    maxLookUp = false;
    x = col;
    y = row + 1;
    while (maxLookUp === false && inCheck === false && y <= 7) {
        let square = boardState[y][x];

        if (square === rook || square === queen) {
            maxLookUp = true;
            inCheck = true;
        }
        else if (square !== '') {
            maxLookUp = true;
        }

        y++;
    }

    if (inCheck === true) {
        console.log('#9');
        return true;
    }

    maxLookUp = false;
    x = col;
    y = row - 1;
    while (maxLookUp === false && inCheck === false && y >= 0) {
        let square = boardState[y][x];

        if (square === rook || square === queen) {
            maxLookUp = true;
            inCheck = true;
        }
        else if (square !== '') {
            maxLookUp = true;
        }

        y--;
    }

    if (inCheck === true) {
        console.log('#10');
        return true;
    }

    return false;
}