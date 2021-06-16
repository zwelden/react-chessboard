import React from 'react';

class ValidMoveSquares extends React.Component {

    render() {
        return (
            <React.Fragment>
                {this.props.locations.map(loc => {
                    console.log(loc);
                    let style = {
                        top: ((7 - loc.row) * 12.5) + '%',
                        left: (loc.col * 12.5) + '%'
                    }

                    return (<div key={loc.row + '-' + loc.col} 
                                className="valid-move-square" 
                                style={style} 
                                onClick={() => {this.props.selectMoveChoice(loc.row, loc.col, loc.type, loc.subType)}}>
                                
                                <div className={'indicator-' + loc.type}></div>
                            </div>);
                })}
            </React.Fragment>
        )
    }
}

export default ValidMoveSquares;