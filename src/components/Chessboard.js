import React from 'react';
import './Chessboard.css';

const Chessboard = ({lastMoveStart, lastMoveEnd, boardOrientation, clearMoveIndicators}) => {
    const createBoard = () => {
        const lastMoveStartClass = 'last-move-start';
        const lastMoveEndClass = 'last-move-end';
        let lastMoveStartRow = lastMoveStart.row;
        let lastMoveStartCol = lastMoveStart.col;
        let lastMoveEndRow = lastMoveEnd.row;
        let lastMoveEndCol = lastMoveEnd.col;
        let boardSquares = [];

        if (boardOrientation === 'black') {
            lastMoveStartRow = 7 - lastMoveStartRow;
            lastMoveStartCol = 7 - lastMoveStartCol;
            lastMoveEndRow = 7 - lastMoveEndRow;
            lastMoveEndCol = 7 - lastMoveEndCol;
        }

        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let squareType = (row + col) % 2;
                let colorClass = (squareType === 1) ? 'light-square' : 'dark-square';
                let style = {
                    top: ((7 - row) * 12.5) + '%',
                    left: (col * 12.5) + '%'
                }
                let isLastMoveStart = false;
                let isLastMoveEnd = false;

                if (row === lastMoveStartRow && col === lastMoveStartCol) {
                    isLastMoveStart = true;
                }
                else if (row === lastMoveEndRow && col === lastMoveEndCol) {
                    isLastMoveEnd = true;
                }
                
                boardSquares.push((
                    <div 
                        key={row + '-' + col} 
                        className={'board-square ' + colorClass} 
                        style={style} 
                        onClick={clearMoveIndicators}
                    >
                        {isLastMoveStart && 
                            <div className={"move-history-square " + lastMoveStartClass}></div>
                        }
                        {isLastMoveEnd && 
                            <div className={"move-history-square " + lastMoveEndClass}></div>
                        }
                    </div>
                ));
            }
        }

        return boardSquares;
    }

    return (
        <React.Fragment>
            {createBoard()}
        </React.Fragment>
    );
}

export default Chessboard;