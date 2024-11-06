import {createSlice, Slice} from "@reduxjs/toolkit";
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
    isMine: boolean;
    isOpened: boolean;
    isFlagged: boolean;
    around: number;
}

export type Game = {
    width: number;
    height: number;
    mines: number;
    map: Cell[][];
    status: typeof GAME_STATUS[keyof typeof GAME_STATUS];
    level: keyof typeof GAME_LEVELS;
    startTime: number;
    endTime: number;
    duration: number;
    flagCount: number;
    openedCount: number;
    mineCount: number;
};

type AppNoteRedux = Game & any

const create_clean_map = (width: number, height: number): Cell[][] => {
    return Array.from({length: height}, () => Array.from({length: width}, () => ({
        isMine: false,
        isOpened: false,
        isFlagged: false,
        around: 0,
    })));
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
    map: create_clean_map(8, 8),
    status: GAME_STATUS.READY,
    level: 'Beginner',
    startTime: 0,
    endTime: 0,
    duration: 0,
    flagCount: 0,
    openedCount: 0,
    mineCount: 0,
};

const gameSlice: Slice<AppNoteRedux> = createSlice({
    name: 'game',
    initialState: INITIAL_GAME_STATE,
    reducers: {
        newGame: (state, action) => {
            state.map = create_clean_map(state.width, state.height);
            state.status = GAME_STATUS.READY;
        },
        changeLevel: (state, action: {payload: {width: number, height: number, mines: number}}) => {
            state.width = action.payload.width;
            state.height = action.payload.height;
            state.mines = action.payload.mines;
            state.map = create_clean_map(state.width, state.height);
            state.status = GAME_STATUS.READY;
        },
        onOpen: (state, action: {payload: {x: number, y: number}}) => {

            if (state.status !== GAME_STATUS.GAME_OVER) {
                return;
            }

            if (state.status === GAME_STATUS.READY) {
                state.map = create_mine_map(state.width, state.height, state.mines, action.payload.x, action.payload.y);
                state.status = GAME_STATUS.PLAYING;
                state.startTime = Date.now();
            }

            const {x, y} = action.payload;
            const cell = state.map[y][x];

            if (cell.isMine) {
                state.status = GAME_STATUS.GAME_OVER;
                state.endTime = Date.now();
                state.duration = state.endTime - state.startTime;
            }

            const openQueue = [{x, y}];

            while (openQueue.length > 0) {
                const {x, y} = openQueue.shift()!;
                const cell = state.map[y][x];
                if (cell.isOpened || cell.isFlagged) {
                    continue;
                }
                cell.isOpened = true;
                state.openedCount++;
                if (cell.around === 0) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const xx = x + dx;
                            const yy = y + dy;
                            if (xx < 0 || xx >= state.width || yy < 0 || yy >= state.height) {
                                continue;
                            }
                            openQueue.push({x: xx, y: yy});
                        }
                    }
                }
            }

        }
    },
});

export const {
    newGame,
    changeLevel
} = gameSlice.actions;

export const selectGame = (state: RootState) => state.game;

export default gameSlice;
