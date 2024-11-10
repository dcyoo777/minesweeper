import React, {useEffect} from 'react';
import './Board.scss';
import {useSelector} from "react-redux";
import {GAME_STATUS, selectGame} from "../../redux/game";

function Board() {

    const {status, duration, flagCount, mines, } = useSelector(selectGame)

    const [spentTime, setSpentTime] = React.useState(0)

    useEffect(() => {
        if (status === GAME_STATUS.PLAYING) {
            const interval = setInterval(() => {
                setSpentTime(prev => prev + 1)
            }, 1000)

            return () => {
                clearInterval(interval)
            }
        }
    }, [status]);

    return (
        <div className={"board"}>
            <div className={"board-score"}>
                {mines - flagCount}
            </div>
            <button className={'board-button'}>
                New Game
            </button>
            <div className={"board-score"}>
                {spentTime}
            </div>
        </div>
    );
}

export default Board;
