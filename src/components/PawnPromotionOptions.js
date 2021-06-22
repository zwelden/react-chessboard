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

const PawnPromotionOptions = ({color, boardOrientation, col, selectPromotionChoice}) => {
    let colorClass = (color === 'white') ? 'white-promotion-options' : 'black-promotion-options';
    let queen = (color === 'white') ? <QueenWhite /> : <QueenBlack />; 
    let rook = (color === 'white') ? <RookWhite /> : <RookBlack />;
    let bishop = (color === 'white') ? <BishopWhite /> : <BishopBlack />;
    let knight = (color === 'white') ? <KnightWhite /> : <KnightBlack />;

    let orientation = boardOrientation;
    let row = (color === 'white') ? 7 : 0;
    let displayAtClass = 'display-at-top';

    let optionsStyle = {};

    optionsStyle.left = (orientation === 'white') ? (col * 12.5) + '%' : ((7 - col) * 12.5) + '%';

    if ((color === 'white' && orientation === 'white')
        || (color === 'black' && orientation === 'black')) { 
        optionsStyle.top = 0;
    }
    else {
        optionsStyle.bottom = 0;
        displayAtClass = 'display-at-bottom'
    }



    return (
        <React.Fragment>
            <div className="promotion-option-screen"></div>
            <div 
                className={"pawn-propmotion-options " + colorClass + " " + displayAtClass} 
                style={optionsStyle}
            >
                <div 
                    className="promotion-option queen-selection" 
                    onClick={() => {selectPromotionChoice('q', row, col)}}
                >
                    {queen}
                </div>
                <div 
                    className="promotion-option rook-selection" 
                    onClick={() => {selectPromotionChoice('r', row, col)}}
                >
                    {rook}
                </div>
                <div 
                    className="promotion-option bishop-selection" 
                    onClick={() => {selectPromotionChoice('b', row, col)}}
                >
                    {bishop}
                </div>
                <div 
                    className="promotion-option knight-selection" 
                    onClick={() => {selectPromotionChoice('n', row, col)}}
                >
                    {knight}
                </div>
            </div>

        </React.Fragment>
    );
}

export default PawnPromotionOptions