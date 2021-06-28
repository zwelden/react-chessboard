import {ReactComponent as FlipBoardIcon} from '../assets/img/switch_icon.svg';
import {ReactComponent as RestartIcon} from '../assets/img/restart.svg';
import {ReactComponent as ChevronLeftIcon} from '../assets/img/chevron_left.svg';
import {ReactComponent as ChevronRightIcon} from '../assets/img/chevron_right.svg';
import {ReactComponent as ChevronDoubleLeftIcon} from '../assets/img/chevron_double_left.svg';
import {ReactComponent as ChevronDoubleRighIcon} from '../assets/img/chevron_double_right.svg';



import './ActionsContainer.css';

const ActionsContainer = ({flipBoardOrientation, restartGame, goToTurn}) => {
    return (
        <div className="actions-container">
            <div className="board-actions">
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
            <div className="history-actions">
                <div className="history-container"></div>
                <div className="history-actions-buttons">
                    <button className="actions-button history-button" onClick={() => {goToTurn('first')}}>
                        <ChevronDoubleLeftIcon />
                        </button>
                    <button className="actions-button history-button" onClick={() => {goToTurn('prev')}}>
                        <ChevronLeftIcon />
                    </button>
                    <button className="actions-button history-button" onClick={() => {goToTurn('next')}}>
                        <ChevronRightIcon />
                    </button>
                    <button className="actions-button history-button" onClick={() => {goToTurn('last')}}>
                        <ChevronDoubleRighIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ActionsContainer;