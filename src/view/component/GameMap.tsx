import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Cell, openCell, selectGameMap} from "../../redux/game";
import './GameMap.scss';
import cn from "classnames";
import {flagCellAction, checkCellAction} from "../../gameAction";

const CELL_SIZE = 30;

function GameMap() {

    const dispatch = useDispatch()

    const gameMap = useSelector(selectGameMap)
    // console.log(gameMap)

    const onClickCell = useCallback((e: React.MouseEvent<HTMLButtonElement>, rowIndex: number, columnIndex: number) => {
        // dispatch(openCell({y: rowIndex, x: columnIndex}))
        checkCellAction(rowIndex, columnIndex)
    }, [])

    const onRightClickCell = useCallback((e: React.MouseEvent<HTMLButtonElement>, rowIndex: number, columnIndex: number) => {
        e.preventDefault()
        console.log('Right Click')
        flagCellAction(rowIndex, columnIndex)
    }, [])

    return (
        <div className={"game-map"} style={{
            width: `${gameMap[0].length * CELL_SIZE}px`,
            gridTemplateColumns: `repeat(${gameMap[0].length}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${gameMap.length}, ${CELL_SIZE}px)`
        }}>
            {gameMap.reduce((result: any[], row: Cell[], rowIndex: number) =>
                result.concat(row.map((cell: Cell, columnIndex: number) => (
                    <button key={`cell-${rowIndex}-${columnIndex}`}
                            className={cn("game-map-cell", {
                                "is-opened": cell.isOpened,
                                "is-mine": cell.isMine,
                                "is-flagged": cell.isFlagged,
                                [`around-${cell.around}`]: cell.isOpened && !cell.isMine
                            })}
                            onClick={(e) => onClickCell(e, rowIndex, columnIndex)}
                            onContextMenu={(e) => onRightClickCell(e, rowIndex, columnIndex)}
                    >
                        {cell.isOpened ? (cell.isMine ? '💣' : cell.around ? cell.around : '') : cell.isFlagged ? '🚩' : ''}
                    </button>
                )))
            , [])}
        </div>
    );
}

export default GameMap;
