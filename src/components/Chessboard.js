import React from 'react';
import './Chessboard.css';
import {ReactComponent as Board} from '../assets/img/chessboard.svg'; 
import {determineValidPieceMoves} from '../utilities/moveEngine.js'
import Piece from './Piece'
import ValidMoveSquares from './ValidMoveSquares';

class Chessboard extends React.Component {
    constructor (props) {
        super(props);

        this.pieceMap = {
            color: {
                'w': 'white',
                'b': 'black'
            },
            piece: {
                'r': 'rook',
                'n': 'knight',
                'b': 'bishop',
                'q': 'queen',
                'k': 'king',
                'p': 'pawn'
            }
        }
        
        let boardPositions = [
            ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw'],
            ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
            ['', '', '', '', '', '', 'rb', ''],
            ['', '', 'bw', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', 'kb', '', '', ''],
            ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
            ['rb', 'nb', 'bb', 'qb', '', 'bb', 'nb', 'rb']
        ];

       let pieceComponents = [];

        boardPositions.forEach((row, row_index) => {
            row.forEach((piece, col_index) => {
                if (piece === '') { return; }

                let pieceType = this.pieceMap.piece[piece.charAt(0)];
                let pieceColor = this.pieceMap.color[piece.charAt(1)];

                
                pieceComponents.push((
                    <Piece key={row_index + '-' + col_index} color={pieceColor} piece={pieceType} row={row_index} col={col_index} determineValidMoves={this.determineValidMoves} />
                ))
            });
        });

        this.state = {
            validMoveSquares: [],
            boardPositions: boardPositions,
            pieceComponents: pieceComponents
        }
    }

    
    displayValidMoveSquares = (validMoves) => {
        this.setState({validMoveSquares: validMoves});
    }

    determineValidMoves = (row, col) => {
        let validMoves = determineValidPieceMoves(this.state.boardPositions, row, col);

        if (validMoves.length > 0) {
            this.displayValidMoveSquares(validMoves);
        }
        else {
            this.setState({validMoveSquares: []});
        }
    }

    clearValidMoves = () => {
        this.setState({validMoveSquares: []});
    }

    render () {
        return (
            <React.Fragment>
                <div className="board-wrapper">
                    <Board onClick={this.clearValidMoves} />
                    {this.state.pieceComponents}
                    <ValidMoveSquares locations={this.state.validMoveSquares} />
                </div>
            </React.Fragment>
        )
    }
}

export default Chessboard;