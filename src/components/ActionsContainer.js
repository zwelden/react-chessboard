import React from 'react';
import {ReactComponent as FlipBoardIcon} from '../assets/img/switch_icon.svg';

import './ActionsContainer.css';

class ActionsContainer extends React.Component {
    render() {
        return (
            <div className="actions-container">
                <button className="flip-board-button" onClick={this.props.flipBoardOrientation}>
                    <FlipBoardIcon />
                </button>
            </div>
        )
    }
}

export default ActionsContainer;