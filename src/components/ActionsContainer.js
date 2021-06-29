import {ReactComponent as FlipBoardIcon} from '../assets/img/switch_icon.svg';
import {ReactComponent as RestartIcon} from '../assets/img/restart.svg';
import {ReactComponent as ChevronLeftIcon} from '../assets/img/chevron_left.svg';
import {ReactComponent as ChevronRightIcon} from '../assets/img/chevron_right.svg';
import {ReactComponent as ChevronDoubleLeftIcon} from '../assets/img/chevron_double_left.svg';
import {ReactComponent as ChevronDoubleRighIcon} from '../assets/img/chevron_double_right.svg';

import { constructNotationPairArr } from '../utilities/helpers';

import './ActionsContainer.css';

const ActionsContainer = ({flipBoardOrientation, restartGame, goToTurn, notationHistory, currentMove}) => {
    let notationPairs = constructNotationPairArr(notationHistory);
    let highlightIdx = Math.floor((currentMove - 1) / 2); 
    let highlightMove = (currentMove % 2 === 0) ? 1 : 0;

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
                <div className="history-container">
                    <div className="notation-header">
                        <div className="move-order">Move</div>
                        <div className="notation-white">White</div>
                        <div className="notation-white">Black</div>
                    </div>
                    {notationPairs.map((notationPair, index) => {
                        let highlightWhite = (highlightIdx === index && highlightMove === 0) ? 'highlight-notation' : '';
                        let highlightBlack = (highlightIdx === index && highlightMove === 1) ? 'highlight-notation' : '';
                        
                        return (<div className="notation-pair-container" key={index}>
                            <div className="move-order">{index + 1}</div>
                            <div className={"notation-white " + highlightWhite}>{notationPair[0]}</div>
                            <div className={"notation-black " + highlightBlack}>{notationPair.length === 2 && notationPair[1]}</div>  
                        </div>)
                    })}
                </div>
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