import React from 'react';
import './EndOfGameDisplay.css';

const EndOfGameDisplay = ({endType, winner}) => {
    let endTypeDisplay = (endType === 'checkmate') ? 'Checkmate' : 'Draw';

    return (
        <React.Fragment>
            <div className="board-cover"></div>
            <div className="end-of-game-display">
                <h2>{endTypeDisplay}</h2>
                {endType === 'stalemate' && (
                    <h4>By way of stalemate</h4>
                )}
                {endType === 'checkmate' && (
                    <h4>{winner.toUpperCase()} wins!</h4>
                )}
            </div>
        </React.Fragment>
    );
}

export default EndOfGameDisplay;