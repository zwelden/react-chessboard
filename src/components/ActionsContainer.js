import {ReactComponent as FlipBoardIcon} from '../assets/img/switch_icon.svg';
import {ReactComponent as RestartIcon} from '../assets/img/restart.svg';

import './ActionsContainer.css';

const ActionsContainer = ({flipBoardOrientation, restartGame}) => {
    return (
        <div className="actions-container">
            <div>
                <button className="actions-button restart-button" onClick={restartGame}>
                    <RestartIcon />
                </button>
            </div>
            <div>
                <button className="actions-button flip-board-button" onClick={flipBoardOrientation}>
                    <FlipBoardIcon />
                </button>
            </div>
        </div>
    );
}

export default ActionsContainer;