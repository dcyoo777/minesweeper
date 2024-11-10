import {
    createMapAvoidPoint,
    flagCell,
    GAME_STATUS,
    openCell,
    openMine, removeFlagCell, selectGame,
    selectGameCell,
    selectGameStatus
} from "./redux/game";
import {storeDispatch, storeState} from "./redux";

export const getAroundCells = (row: number, col: number, width: number, height: number) => {
    const aroundCells = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const xx = col + dx;
            const yy = row + dy;
            if (dx === 0 && dy === 0) {
                continue;
            }
            if (xx < 0 || xx >= width || yy < 0 || yy >= height) {
                continue;
            }
            const targetCell = selectGameCell(storeState(), yy, xx);
            aroundCells.push(targetCell);
        }
    }
    return aroundCells;
}

export const checkCellAction = (row: number, col: number) => {

    const status = selectGameStatus(storeState());
    console.log(status)
    if (status === GAME_STATUS.GAME_OVER) {
        return;
    }

    if (status === GAME_STATUS.READY) {
        storeDispatch(createMapAvoidPoint({row, col}));
    }

    const {width, height} = selectGame(storeState());
    const cell = selectGameCell(storeState(), row, col);

    if (cell.isMine) {
        storeDispatch(openMine(storeState()));
        return;
    }

    if (cell.isOpened && cell.around > 0) {
        const aroundCells = getAroundCells(row, col, width, height);
        if (cell.around === aroundCells.filter(targetCell => targetCell.isFlagged).length){
            aroundCells.filter(c => !c.isFlagged && !c.isOpened).forEach(targetCell => {
                storeDispatch(openCell({row: targetCell.row, col: targetCell.col}));
            });
        }
        return;
    }

    const openQueue = [{row, col}];

    while (openQueue.length > 0) {
        const {row: r, col: c} = openQueue.shift()!;
        const targetCell = selectGameCell(storeState(), r, c);
        console.log(r, c, targetCell)
        if (targetCell.isOpened || targetCell.isFlagged) {
            continue;
        }
        storeDispatch(openCell({row: r, col: c}));
        if (targetCell.around === 0) {
            const aroundCells = getAroundCells(r, c, width, height);
            aroundCells.forEach(cell => {
                openQueue.push({row: cell.row, col: cell.col});
            });
        }
    }

}

export const flagCellAction = (row: number, col: number) => {
    const cell = selectGameCell(storeState(), row, col);
    if (cell.isOpened) {
        return;
    }
    if (cell.isFlagged) {
        storeDispatch(removeFlagCell({row, col}));
        return
    }
    storeDispatch(flagCell({row, col}));
}
