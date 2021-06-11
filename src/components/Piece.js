import React from 'react'; 
import {ReactComponent as KingWhite} from '../assets/img/king_white.svg';
import {ReactComponent as QueenWhite} from '../assets/img/queen_white.svg';
import {ReactComponent as RookWhite} from '../assets/img/rook_white.svg';
import {ReactComponent as BishopWhite} from '../assets/img/bishop_white.svg';
import {ReactComponent as KnightWhite} from '../assets/img/knight_white.svg';
import {ReactComponent as PawnWhite} from '../assets/img/pawn_white.svg';
import {ReactComponent as KingBlack} from '../assets/img/king_black.svg';
import {ReactComponent as QueenBlack} from '../assets/img/queen_black.svg';
import {ReactComponent as RookBlack} from '../assets/img/rook_black.svg';
import {ReactComponent as BishopBlack} from '../assets/img/bishop_black.svg';
import {ReactComponent as KnightBlack} from '../assets/img/knight_black.svg';
import {ReactComponent as PawnBlack} from '../assets/img/pawn_black.svg';

class Piece extends React.Component {
    constructor(props) {
        super(props);

        let pieceComponents = {
            'white': {
                'king': (<KingWhite />),
                'queen': (<QueenWhite />),
                'rook': (<RookWhite />),
                'bishop': (<BishopWhite />),
                'knight': (<KnightWhite />),
                'pawn': (<PawnWhite />)
            },
            'black': {
                'king': (<KingBlack />),
                'queen': (<QueenBlack />),
                'rook': (<RookBlack />),
                'bishop': (<BishopBlack />),
                'knight': (<KnightBlack />),
                'pawn': (<PawnBlack />)
            }
        }

        this.renderPiece = pieceComponents[this.props.color][this.props.piece];
        
        this.state = {
            postitionStyles: {
                position: 'absolute',
                top: ((7 - this.props.row) * 12.5) + '%',
                left: (this.props.col * 12.5) + '%',
                height: '12.5%',
                width: '12.5%',
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'center'
            },
            row: this.props.row,
            col: this.props.col
        }
    }

    displayValidMoves = () => {
        alert('displaying valid moves');
    }

    render() {
        return (
            <div className="piece-container" style={this.state.postitionStyles} onClick={this.displayValidMoves}>
                {this.renderPiece}
            </div>
        )
    }
}

export default Piece;