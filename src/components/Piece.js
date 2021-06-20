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

import './Piece.css';

class Piece extends React.Component {
    pieceComponents = {
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

    generateStyle = (orientation, row, col) => {
        let rowOrientationModifier = (orientation === 'white') ? 7 : 0;
        let rowMultiplier = (orientation === 'white') ? -1 : 1;
        let colOrientationModifier = (orientation === 'white') ? 0 : 7;
        let colMultiplier = (orientation === 'white') ? 1 : -1;

        return {
            top: ((rowOrientationModifier + (rowMultiplier * row)) * 12.5) + '%',
            left: ((colOrientationModifier + (colMultiplier * col)) * 12.5) + '%'
        }
    }

    render() {
        let inCheckClass = (this.props.inCheck === true) ? 'in-check' : '';
        let lastMoveStartClass = (this.props.lastMoveStart === true) ? 'last-move-start' : '';
        let lastMoveEndClass = (this.props.lastMoveEnd === true) ? 'last-move-end' : '';

        return (
            <div className={"piece-container " + inCheckClass + lastMoveStartClass + lastMoveEndClass}
                style={this.generateStyle(this.props.orientation, this.props.row, this.props.col)} 
                onClick={() => this.props.determineValidMoves(this.props.row, this.props.col)}>
                {this.pieceComponents[this.props.color][this.props.piece]}
            </div>
        )
    }
}

export default Piece;