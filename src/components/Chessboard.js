import React from 'react';

class Chessboard extends React.Component {
    createBoard = () => {
        let lastMoveStartClass = 'last-move-start';
        let lastMoveEndClass = 'last-move-end';

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

                if (row === this.props.lastMoveStart.row && col === this.props.lastMoveStart.col) {
                    isLastMoveStart = true;
                }
                else if (row === this.props.lastMoveEnd.row && col === this.props.lastMoveEnd.col) {
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