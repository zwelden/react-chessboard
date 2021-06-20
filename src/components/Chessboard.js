import React from 'react';

class Chessboard extends React.Component {
    createBoard = () => {
        let lastMoveStartClass = 'last-move-start';
        let lastMoveEndClass = 'last-move-end';
        let lastMoveStartRow = this.props.lastMoveStart.row;
        let lastMoveStartCol = this.props.lastMoveStart.col;
        let lastMoveEndRow = this.props.lastMoveEnd.row;
        let lastMoveEndCol = this.props.lastMoveEnd.col;

        if (this.props.boardOrientation === 'black') {
            lastMoveStartRow = 7 - lastMoveStartRow;
            lastMoveStartCol = 7 - lastMoveStartCol;
            lastMoveEndRow = 7 - lastMoveEndRow;
            lastMoveEndCol = 7 - lastMoveEndCol;
        }

        let boardSquares = [];
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
                        onClick={this.props.clearMoveIndicators}>
                        
                        {isLastMoveStart && <div className={"move-history-square " + lastMoveStartClass}></div>}
                        {isLastMoveEnd && <div className={"move-history-square " + lastMoveEndClass}></div>}
                    </div>
                ));
            }
        }

        return boardSquares;
    }

    render () {
        return (
            <React.Fragment>
                {this.createBoard()}
            </React.Fragment>
        );
    }
}

export default Chessboard;