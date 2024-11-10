import React, {useCallback, useEffect, useMemo} from 'react';
import './Board.scss';
import {useDispatch, useSelector} from "react-redux";
import {GAME_STATUS, newGame, selectGame} from "../../redux/game";

function Board() {

    const dispatch = useDispatch();

    const {status, flagCount, mines} = useSelector(selectGame)

    const [spentTime, setSpentTime] = React.useState(0)

    const isClear = useMemo(() => status === GAME_STATUS.GAME_OVER && mines === flagCount, [status, mines, flagCount])

    const onClickNewGame = useCallback(() => {
        // @ts-ignore
        dispatch(newGame())
    }, [dispatch])

    useEffect(() => {
        if (status === GAME_STATUS.PLAYING) {
            const interval = setInterval(() => {
                setSpentTime(prev => prev + 1)
            }, 1000)

            return () => {
                clearInterval(interval)
            }
        }
        if (status === GAME_STATUS.READY) {
            setSpentTime(0)
        }
    }, [status]);

    return (
        <div className={"board"}>
            <div className={"board-data"}>
                <div className={"board-data-label"}>Remain Mines</div>
                <div className={"board-data-value"}>{mines - flagCount}</div>
            </div>
            <button className={'board-button'} onClick={onClickNewGame}>
                New Game
            </button>
            <div className={"board-data"}>
                <div className={"board-data-label"}>Spend Time</div>
                <div className={"board-data-value"}>{spentTime}</div>
            </div>
        </div>
    );
}

export default Board;
