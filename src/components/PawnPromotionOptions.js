import React from 'react';
import {ReactComponent as QueenWhite} from '../assets/img/queen_white.svg';
import {ReactComponent as RookWhite} from '../assets/img/rook_white.svg';
import {ReactComponent as BishopWhite} from '../assets/img/bishop_white.svg';
import {ReactComponent as KnightWhite} from '../assets/img/knight_white.svg';
import {ReactComponent as QueenBlack} from '../assets/img/queen_black.svg';
import {ReactComponent as RookBlack} from '../assets/img/rook_black.svg';
import {ReactComponent as BishopBlack} from '../assets/img/bishop_black.svg';
import {ReactComponent as KnightBlack} from '../assets/img/knight_black.svg';

import './PawnPromotionOptions.css';

class PawnPromotionOptions extends React.Component {
    render () {
        let colorSide = this.props.color;
        let colorClass = (colorSide === 'white') ? 'white-promotion-options' : 'black-promotion-options';
        let queen = (colorSide === 'white') ? <QueenWhite /> : <QueenBlack />; 
        let rook = (colorSide === 'white') ? <RookWhite /> : <RookBlack />;
        let bishop = (colorSide === 'white') ? <BishopWhite /> : <BishopBlack />;
        let knight = (colorSide === 'white') ? <KnightWhite /> : <KnightBlack />;

        let orientation = this.props.boardOrientation;
        let row = (colorSide === 'white') ? 7 : 0;
        let col = this.props.col;
        let displayAtClass = 'display-at-top';

        let optionsStyle = {};

        optionsStyle.left = (orientation === 'white') ? (col * 12.5) + '%' : ((7 - col) * 12.5) + '%';

        if ((colorSide === 'white' && orientation === 'white')
            || (colorSide === 'black' && orientation === 'black')) { 
            optionsStyle.top = 0;
        }
        else {
            optionsStyle.bottom = 0;
            displayAtClass = 'display-at-bottom'
        }



        return (
            <React.Fragment>
                <div className="promotion-option-screen"></div>
                <div className={"pawn-propmotion-options " + colorClass + " " + displayAtClass} style={optionsStyle}>
                    <div className="promotion-option queen-selection" onClick={() => {this.props.selectPromotionChoice('q', row, col)}}>
                        {queen}
                    </div>
                    <div className="promotion-option rook-selection" onClick={() => {this.props.selectPromotionChoice('r', row, col)}}>
                        {rook}
                    </div>
                    <div className="promotion-option bishop-selection" onClick={() => {this.props.selectPromotionChoice('b', row, col)}}>
                        {bishop}
                    </div>
                    <div className="promotion-option knight-selection" onClick={() => {this.props.selectPromotionChoice('n', row, col)}}>
                        {knight}
                    </div>
                </div>

            </React.Fragment>
            
        ) 
    }
}

export default PawnPromotionOptions