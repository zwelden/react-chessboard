import React from 'react';

class ValidMoveSquares extends React.Component {
    render() {
        console.log(this.props.locations);
        return (
            <React.Fragment>
                {this.props.locations.map(loc => {
                    let style = {
                        top: ((7 - loc.row) * 12.5) + '%',
                        left: (loc.col * 12.5) + '%'
                    }

                    return (<div key={loc.row + '-' + loc.col} className="valid-move-square" style={style}><div className={'indicator-' + loc.type}></div></div>);
                })}
            </React.Fragment>
        )
    }
}

export default ValidMoveSquares;