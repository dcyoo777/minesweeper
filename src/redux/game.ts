import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {RootState} from "./index";

export const GAME_LEVELS = {
    "Beginner": {width: 8, height: 8, mines: 10},
    "Intermediate": {width: 16, height: 16, mines: 40},
    "Expert": {width: 30, height: 16, mines: 100},
} as const;

export const GAME_STATUS = {
    "READY": "READY",
    "PLAYING": "PLAYING",
    "GAME_OVER": "GAME_OVER",
} as const;

export type Cell = {
    row: number;
    col: number;
    isMine: boolean;
    isOpened: boolean;
    isFlagged: boolean;
    around: number;
}

export type Game = {
    width: number;
    height: number;
    mines: number;
    gameMap: Cell[][];
    status: typeof GAME_STATUS[keyof typeof GAME_STATUS];
    startTime: number;
    endTime: number;
    duration: number;
    flagCount: number;
    openedCount: number;
};

type AppNoteRedux = Game

const create_clean_map = (width: number, height: number): Cell[][] => {
    const map: Cell[][] = [];
    for (let row = 0; row < height; row++) {
        const temp: Cell[] = [];
        for (let col = 0; col < width; col++) {
            temp.push({
                row,
                col,
                isMine: false,
                isOpened: false,
                isFlagged: false,
                around: 0,
            } as Cell);
        }
        map.push(temp);
    }
    return map;
}

const create_mine_map = (width: number, height: number, mines: number, avoidX: number, avoidY: number): Cell[][] => {
    let count = 0;
    const newMap = create_clean_map(width, height);
    while (count < mines) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        if (Math.abs(avoidX - x) < 2 && Math.abs(avoidY - y) < 2) {
            continue;
        }
        if (newMap[y][x].isMine) {
            continue;
        }
        newMap[y][x].isMine = true;
        count++;
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (newMap[y][x].isMine) {
                continue;
            }
            let around = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) {
                        continue;
                    }
                    const xx = x + dx;
                    const yy = y + dy;
                    if (xx < 0 || xx >= width || yy < 0 || yy >= height) {
                        continue;
                    }
                    if (newMap[yy][xx].isMine) {
                        around++;
                    }
                }
            }
            newMap[y][x].around = around;
        }
    }
    return newMap;
}

const INITIAL_GAME_STATE: AppNoteRedux = {
    width: 8,
    height: 8,
    mines: 10,
    gameMap: create_clean_map(8, 8),
    status: GAME_STATUS.READY,
    startTime: 0,
    endTime: 0,
    duration: 0,
    flagCount: 0,
    openedCount: 0,
};

const gameSlice: Slice<AppNoteRedux> = createSlice({
    name: 'game',
    initialState: INITIAL_GAME_STATE,
    reducers: {
        newGame: (state) => {
            state.gameMap = create_clean_map(state.width, state.height);
            state.status = GAME_STATUS.READY;
        },
        changeLevel: (state, action: {payload: {width: number, height: number, mines: number}}) => {
            state.width = action.payload.width;
            state.height = action.payload.height;
            state.mines = action.payload.mines;
            state.gameMap = create_clean_map(state.width, state.height);
            state.status = GAME_STATUS.READY;
            localStorage.setItem('level', JSON.stringify({width: state.width, height: state.height, mines: state.mines}));
        },
        createMapAvoidPoint: (state, action: PayloadAction<{row: number, col: number}>) => {
            const {row, col} = action.payload;
            state.gameMap = create_mine_map(state.width, state.height, state.mines, col, row);
            state.openedCount = 0;
            state.flagCount = 0;
            state.status = GAME_STATUS.PLAYING;
            state.startTime = Date.now();
        },
        openCell: (state, action: PayloadAction<{row: number, col: number}>) => {
            const {row, col} = action.payload;
            state.gameMap[row][col].isOpened = true;
            state.openedCount++;
            if (state.width * state.height === state.flagCount + state.openedCount) {
                state.status = GAME_STATUS.GAME_OVER;
                state.endTime = Date.now();
                state.duration = state.endTime - state.startTime;
                // @ts-ignore
                const level = Object.keys(GAME_LEVELS).find((level) => GAME_LEVELS[level].width === state.width && GAME_LEVELS[level].height === state.height && GAME_LEVELS[level].mines === state.mines);
                if (level) {
                    const lastTime = localStorage.getItem(level) ? parseInt(localStorage.getItem(level)!) : 9999;
                    localStorage.setItem(level, Math.min(Math.floor(state.duration / 1000), lastTime).toString());
                }
            }
        },
        openMine: (state) => {
            state.gameMap.forEach(row => {
                row.forEach(cell => {
                    if (cell.isMine) {
                        cell.isOpened = true;
                    }
                });
            });
            state.status = GAME_STATUS.GAME_OVER;
            state.endTime = Date.now();
            state.duration = state.endTime - state.startTime;
        },
        flagCell: (state, action: PayloadAction<{row: number, col: number}>) => {
            const {row, col} = action.payload;
            state.gameMap[row][col].isFlagged = true;
            state.flagCount += 1;
            if (state.width * state.height === state.flagCount + state.openedCount) {
                state.status = GAME_STATUS.GAME_OVER;
                state.endTime = Date.now();
                state.duration = state.endTime - state.startTime;
                // @ts-ignore
                const level = Object.keys(GAME_LEVELS).find((level) => GAME_LEVELS[level].width === state.width && GAME_LEVELS[level].height === state.height && GAME_LEVELS[level].mines === state.mines);
                if (level) {
                    const lastTime = localStorage.getItem(level) ? parseInt(localStorage.getItem(level)!) : 9999;
                    localStorage.setItem(level, Math.min(Math.floor(state.duration / 1000), lastTime).toString());
                }
            }
        },
        removeFlagCell: (state, action: PayloadAction<{row: number, col: number}>) => {
            const {row, col} = action.payload;
            state.gameMap[row][col].isFlagged = false;
            state.flagCount -= 1;
        }
    },
});

export const {
    newGame,
    changeLevel,
    createMapAvoidPoint,
    openCell,
    openMine,
    flagCell,
    removeFlagCell
} = gameSlice.actions;

export const selectGame = (state: RootState) => state.game;
export const selectGameStatus = (state: RootState) => state.game.status;
export const selectGameMap = (state: RootState) => state.game.gameMap;
export const selectGameCell = (state: RootState, row: number, col: number) => state.game.gameMap[row][col];

export default gameSlice;
