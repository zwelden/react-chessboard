import React from 'react';
import './EndOfGameDisplay.css';

class EndOfGameDisplay extends React.Component {
    render () {
        let endCondition = this.props.endType;
        let endTypeDisplay = (endCondition === 'checkmate') ? 'Checkmate' : 'Draw';
        let winner = this.props.winner;

        return (
            <React.Fragment>
                <div className="board-cover"></div>
                <div className="end-of-game-display">
                    <h2>{endTypeDisplay}</h2>
                    {endCondition === 'stalemate' && (
                        <h4>By way of stalemate</h4>
                    )}
                    {endCondition === 'checkmate' && (
                        <h4>{winner.toUpperCase()} wins!</h4>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default EndOfGameDisplay;