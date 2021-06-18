import React from 'react';

class ValidMoveSquares extends React.Component {

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
        return (
            <React.Fragment>
                {this.props.locations.map(loc => {
                    return (<div key={loc.row + '-' + loc.col} 
                                className="valid-move-square" 
                                style={this.generateStyle(this.props.boardOrientation, loc.row, loc.col)} 
                                onClick={() => {this.props.selectMoveChoice(loc.row, loc.col, loc.type, loc.subType)}}>
                                
                                <div className={'indicator-' + loc.type}></div>
                            </div>);
                })}
            </React.Fragment>
        )
    }
}

export default ValidMoveSquares;