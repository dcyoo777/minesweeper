import React, {useCallback, useEffect, useMemo} from 'react';
import {useSelector} from "react-redux";
import {Cell, GAME_STATUS, selectGame, selectGameMap} from "../../redux/game";
import './GameMap.scss';
import cn from "classnames";
import {flagCellAction, checkCellAction} from "../../gameAction";

const CELL_SIZE = 30;

function GameMap() {

    const {status, mines, flagCount, duration} = useSelector(selectGame)
    const gameMap = useSelector(selectGameMap)

    const onClickCell = useCallback((e: React.MouseEvent<HTMLButtonElement>, rowIndex: number, columnIndex: number) => {
        checkCellAction(rowIndex, columnIndex)
    }, [])

    const onRightClickCell = useCallback((e: React.MouseEvent<HTMLButtonElement>, rowIndex: number, columnIndex: number) => {
        e.preventDefault()
        flagCellAction(rowIndex, columnIndex)
    }, [])

    const isClear = useMemo(() => status === GAME_STATUS.GAME_OVER && mines === flagCount && duration, [status, mines, flagCount, duration])
    const isDead = useMemo(() => status === GAME_STATUS.GAME_OVER && (mines !== flagCount || !duration), [status, mines, flagCount, duration])

    return (
        <>

            {isClear && <div className={"game-map-status"}>🎉 Congratulation!! 🎉</div>}
            {isDead && <div className={"game-map-status"}>💀 GAME OVER 💀</div>}
            <div className={"game-map-wrapper"}>
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
            </div>
        </>
    );
}

export default GameMap;
