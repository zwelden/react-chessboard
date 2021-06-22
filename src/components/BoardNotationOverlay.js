import React from 'react';
import './BoardNotationOverlay.css';

const BoardNotationOverlay = ({boardOrientation}) => {

    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const numbers = ['1', '2', '3', '4', '5', '6' , '7' , '8'];

    const generateStyle = (row, col, type) => {     
        let rowOrientationModifier = (boardOrientation === 'white') ? 7 : 0;
        let rowMultiplier = (boardOrientation === 'white') ? -1 : 1;
        let colOrientationModifier = (boardOrientation === 'white') ? 0 : 7;
        let colMultiplier = (boardOrientation === 'white') ? 1 : -1;
        

        if (type === 'letters') {
            rowOrientationModifier = 7;
            rowMultiplier = -1;
        }
        else if (type === 'numbers') {
            colOrientationModifier = 0;
            colMultiplier = 1;
        }

        return {
            top: ((rowOrientationModifier + (rowMultiplier * row)) * 12.5) + '%',
            left: ((colOrientationModifier + (colMultiplier * col)) * 12.5) + '%'
        }
    }

    const generateColorClass = (row, col) => {
        let squareType = (row + col) % 2;
        let targetVal = (boardOrientation === 'white') ? 1 : 0;
        return (squareType === targetVal) ? 'light-square-char' : 'dark-square-char';
    }

    return (
        <React.Fragment>
            {letters.map((char, index) => {
                return (<div 
                            key={index} 
                            className={'board-notation-item board-notation-letter ' + generateColorClass(0, index)}
                            style={generateStyle(0, index, 'letters')}
                        >
                            <div className="board-notation-indicator">
                                {char}
                            </div>
                        </div>)
            })}

            {numbers.map((num, index) => {
                return (<div 
                            key={index} 
                            className={'board-notation-item board-notation-number ' + generateColorClass(index, 0)}
                            style={generateStyle(index, 0, 'numbers')}
                        >
                            <div className="board-notation-indicator">
                                {num}
                            </div>
                        </div>)
            })}
        </React.Fragment>
    );
}

export default BoardNotationOverlay;