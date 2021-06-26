import React, {useReducer} from 'react';

import { initialState, reducer } from '../utilities/ChessBoardReducer';

import Chessboard from './Chessboard';
import BoardNotationOverlay from './BoardNotationOverlay';
import ChessboardPieces from './ChessboardPieces';
import ValidMoveSquares from './ValidMoveSquares';
import ActionsContainer from './ActionsContainer';
import PawnPromotionOptions from './PawnPromotionOptions';
import EndOfGameDisplay from './EndOfGameDisplay';

import './ChessboardContainer.css';


const ChessboardContainer = (props) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const dispatchUpdateValidMoveSquares = (row, col) => {
        dispatch({
            type: 'updateValidMoveSquares', 
            payload: {
                row: row,
                col: col
            }
        });
    }

    const selectMoveChoice = (toRow, toCol, moveType, moveSubType) => {
        dispatch({
            type: 'updateStatePostMove',
            payload: {
                toRow: toRow,
                toCol: toCol,
                moveType: moveType,
                moveSubType: moveSubType
            }
        });
    }

    const selectPromotionChoice = (newPiece, row, col) => {
        dispatch({
            type: 'updateStatePostPromotion',
            payload: {
                newPiece: newPiece,
                row: row,
                col: col
            }
        });
    }

    return (
        <React.Fragment>
            <div className="board-wrapper">
                <Chessboard 
                    clearMoveIndicators={() => {dispatch({type: 'clearValidMoveSquares'})}}
                    boardOrientation={state.boardOrientation}
                    lastMoveStart={state.lastMoveStart}
                    lastMoveEnd={state.lastMoveEnd}
                />
                <BoardNotationOverlay boardOrientation={state.boardOrientation} />
                <ChessboardPieces 
                    boardPositions={state.boardPositions} 
                    boardOrientation={state.boardOrientation}
                    determineValidMoves={dispatchUpdateValidMoveSquares}
                    whiteInCheck={state.whiteInCheck}
                    blackInCheck={state.blackInCheck}
                />
                <ValidMoveSquares 
                    locations={state.validMoveSquares} 
                    selectMoveChoice={selectMoveChoice} 
                    boardOrientation={state.boardOrientation}
                />
                {state.displayPromotionOptions && 
                    <PawnPromotionOptions 
                        boardOrientation={state.boardOrientation} 
                        col={state.promoteColumn}
                        color={state.currentPlayer}
                        selectPromotionChoice={selectPromotionChoice}
                    />
                }
                {state.gameOver && 
                    <EndOfGameDisplay 
                        endType={state.outcome} 
                        winner={state.winner}
                    />
                }
            </div>
            <div className="actions-pane">
                <ActionsContainer 
                    restartGame={() => {dispatch({type: 'restartGame'})}}
                    flipBoardOrientation={() => dispatch({type: 'flipBoardOrientation'})} 
                />
            </div>
        </React.Fragment>
    );
}

export default ChessboardContainer;