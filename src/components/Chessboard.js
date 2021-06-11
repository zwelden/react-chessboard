import React from 'react';
import './Chessboard.css';
import {ReactComponent as Board} from '../assets/img/chessboard.svg'; 
import Piece from './Piece'

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
        
        this.boardPositions = [
            ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw'],
            ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
            ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb']
        ];

        this.pieceComponents = [];

        this.boardPositions.forEach((row, row_index) => {
            row.forEach((piece, col_index) => {
                if (piece === '') { return; }

                let postitionStyles = {
                    position: 'absolute',
                    top: ((7 - row_index) * 12.5) + '%',
                    left: (col_index * 12.5) + '%',
                    height: '12.5%',
                    width: '12.5%',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center'
                }

                let pieceType = this.pieceMap.piece[piece.charAt(0)];
                let pieceColor = this.pieceMap.color[piece.charAt(1)];

                
                this.pieceComponents.push((
                    <div className="piece-container" style={postitionStyles}>
                        <Piece color={pieceColor} piece={pieceType} />
                    </div>
                ))
            });
        });
    }

    render () {
        return (
            <div className="board-wrapper">
                <Board />
                {this.pieceComponents.map(component => component)}
            </div>
        )
    }
}

export default Chessboard;