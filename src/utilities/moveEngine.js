export const determineValidPieceMoves = (boardState, row, col) => {
    let pieceToMove = boardState[row][col];
    let pieceType = '';
    let pieceColor = '';
    
    if (pieceToMove.length < 2) {
        return [];
    }

    pieceType = pieceToMove.charAt(0);
    pieceColor = pieceToMove.charAt(1);

    let validMoves = [];


    switch (pieceType) {
        case 'p':
            validMoves = validPawnMoves(pieceColor, boardState, row, col);
            break;
        
        case 'n':
            validMoves = validKnightMoves(pieceColor, boardState, row, col);
            break;

        case 'b':
            validMoves = validBishopMoves(pieceColor, boardState, row, col);
            break;
    
        case 'r':
            validMoves = validRookMoves(pieceColor, boardState, row, col);
            break;

        case 'q':
            validMoves = validQueenMoves(pieceColor, boardState, row, col);
            break;

        case 'k':
            validMoves = validKingMoves(pieceColor, boardState, row, col);
            break;
        
        
        default:
            break;
    }

    return validMoves;
}


const validPawnMoves = (pieceColor, boardState, row, col) => {
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
    else if (pieceColor === 'b') {
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

        if (square === '') {
            validMoves.push({row: move.r, col: move.c, type: 'move'});
        }
    });

    attackMoves.forEach(move => {
        if (move.r < 0 || move.r > 7 || move.c < 0 || move.c > 7) {
            return;
        }

        let square = boardState[move.r][move.c];

        if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: move.r, col: move.c, type: 'capture'});
        }
    });

    return validMoves;
}


const validKnightMoves = (pieceColor, boardState, row, col) => {
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

        if (square === '') {
            validMoves.push({row: move.r, col: move.c, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: move.r, col: move.c, type: 'capture'});
        }
    });

    return validMoves;
}


const validBishopMoves = (pieceColor, boardState, row, col) => {
    return validDiagonalMoves(pieceColor, boardState, row, col);
}


const validRookMoves = (pieceColor, boardState, row, col) => {
    return validHorizontalVerticalMoves(pieceColor, boardState, row, col);
}


const validQueenMoves = (pieceColor, boardState, row, col) => {
    let diagonalMoves = validDiagonalMoves(pieceColor, boardState, row, col);
    let horizontalMoves = validHorizontalVerticalMoves(pieceColor, boardState, row, col);

    return diagonalMoves.concat(horizontalMoves);
}


const validKingMoves = (pieceColor, boardState, row, col) => {
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

        if (square === '') {
            validMoves.push({row: move.r, col: move.c, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: move.r, col: move.c, type: 'capture'});
        }
    });

    return validMoves;
}


const validDiagonalMoves = (pieceColor, boardState, row, col) => {
    let validMoves = [];
    let maxMove = false;
    let x = col + 1;
    let y = row + 1;

    while (maxMove === false && x <= 7 && y <= 7) {
        let square = boardState[y][x];

        if (square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else {
            maxMove = true;
        }

        x++;
        y++;
    }

    maxMove = false;
    x = col + 1;
    y = row - 1;
    while (maxMove === false && x <= 7 && y >= 0) {
        let square = boardState[y][x];

        if (square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else {
            maxMove = true;
        }

        x++;
        y--;
    }

    maxMove = false;
    x = col - 1;
    y = row + 1;
    while (maxMove === false && x >= 0 && y <= 7) {
        let square = boardState[y][x];

        if (square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else {
            maxMove = true;
        }

        x--;
        y++;
    }

    maxMove = false;
    x = col - 1;
    y = row - 1;
    while (maxMove === false && x >= 0 && y >= 0) {
        let square = boardState[y][x];

        if (square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else {
            maxMove = true;
        }

        x--;
        y--;
    }


    return validMoves;
}


const validHorizontalVerticalMoves = (pieceColor, boardState, row, col) => {
    let validMoves = [];
    let maxMove = false;
    let x = col;
    let y = row + 1;

    while (maxMove === false && y <= 7) {
        let square = boardState[y][x];

        if (square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else {
            maxMove = true;
        }

        y++;
    }

    maxMove = false;
    x = col;
    y = row - 1;
    while (maxMove === false && y >= 0) {
        let square = boardState[y][x];

        if (square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else {
            maxMove = true;
        }

        y--;
    }

    maxMove = false;
    x = col + 1;
    y = row;
    while (maxMove === false && x <= 7) {
        let square = boardState[y][x];

        if (square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else {
            maxMove = true;
        }

        x++;
    }

    maxMove = false;
    x = col - 1;
    y = row;
    while (maxMove === false && x >= 0) {
        let square = boardState[y][x];

        if (square === '') {
            validMoves.push({row: y, col: x, type: 'move'});
        }
        else if (square !== '' && square.charAt(1) !== pieceColor) {
            validMoves.push({row: y, col: x, type: 'capture'});
            maxMove = true;
        }
        else {
            maxMove = true;
        }

        x--;
    }

    return validMoves;
}