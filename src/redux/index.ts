import {Action, configureStore} from "@reduxjs/toolkit";
import gameSlice from "./game";

const store = configureStore({
    reducer: {
        game: gameSlice.reducer,
    },
});

store.subscribe(() => {});

export const storeDispatch = (action: Action) => store.dispatch(action);
export default store;
export const storeState = () => store.getState();
export type RootState = ReturnType<typeof store.getState>;
