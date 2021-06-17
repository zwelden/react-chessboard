import React from 'react';

class Chessboard extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            boardSquares: this.createBoard()
        }
    }

    createBoard = () => {
        let boardSquares = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let squareType = (row + col) % 2;
                let colorClass = (squareType === 1) ? 'light-square' : 'dark-square';
                let style = {
                    top: ((7 - row) * 12.5) + '%',
                    left: (col * 12.5) + '%'
                }

                boardSquares.push((
                    <div key={row + '-' + col} className={'board-square ' + colorClass} style={style}></div>
                ));
            }
        }

        return boardSquares;
    }

    render () {
        return (
            <React.Fragment>
                {this.state.boardSquares}
            </React.Fragment>
        );
    }
}

export default Chessboard;