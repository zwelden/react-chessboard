import {ReactComponent as FlipBoardIcon} from '../assets/img/switch_icon.svg';

import './ActionsContainer.css';

const ActionsContainer = ({flipBoardOrientation}) => {
    return (
        <div className="actions-container">
            <button className="flip-board-button" onClick={flipBoardOrientation}>
                <FlipBoardIcon />
            </button>
        </div>
    );
}

export default ActionsContainer;