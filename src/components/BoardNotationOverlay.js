import React from 'react';
import './BoardNotationOverlay.css';

class BoardNotationOverlay extends React.Component {

    letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    numbers = ['1', '2', '3', '4', '5', '6' , '7' , '8'];

    generateStyle = (orientation, row, col, type) => {     
        let rowOrientationModifier = (orientation === 'white') ? 7 : 0;
        let rowMultiplier = (orientation === 'white') ? -1 : 1;
        let colOrientationModifier = (orientation === 'white') ? 0 : 7;
        let colMultiplier = (orientation === 'white') ? 1 : -1;
        

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

    generateColorClass = (orientation, row, col) => {
        let squareType = (row + col) % 2;
        let targetVal = (orientation === 'white') ? 1 : 0;
        return (squareType === targetVal) ? 'light-square-char' : 'dark-square-char';
    }

    render () {
        return (
            <React.Fragment>
                {this.letters.map((char, index) => {
                    return (<div 
                                key={index} 
                                className={'board-notation-item board-notation-letter ' + this.generateColorClass(this.props.boardOrientation, 0, index)}
                                style={this.generateStyle(this.props.boardOrientation, 0, index, 'letters')}>
                                
                                <div className="board-notation-indicator">
                                    {char}
                                </div>
                            </div>)
                })}

                {this.numbers.map((num, index) => {
                    return (<div 
                                key={index} 
                                className={'board-notation-item board-notation-number ' + this.generateColorClass(this.props.boardOrientation, index, 0)}
                                style={this.generateStyle(this.props.boardOrientation, index, 0, 'numbers')}>
                                
                                <div className="board-notation-indicator">
                                    {num}
                                </div>
                            </div>)
                })}
            </React.Fragment>
        )
    }
}

export default BoardNotationOverlay;