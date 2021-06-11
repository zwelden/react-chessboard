import React from 'react';
import {ReactComponent as Board} from '../assets/img/chessboard.svg'; 
import Piece from './Piece'

class Chessboard extends React.Component {
    render () {
        return (
            <React.Fragment>
                <Board />
                <Piece color="white" piece="rook" />
            </React.Fragment>
        )
    }
}

export default Chessboard;