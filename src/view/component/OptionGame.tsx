import React, {useCallback} from 'react'
import './OptionGame.scss'
import {useDispatch} from "react-redux";
import {changeLevel, GAME_LEVELS, newGame} from "../../redux/game";
import useClickOutside from "../../hook/useClickOutside";
import LevelCustomModal from "./LevelCustomModal";
import PersonalBestModal from "./PersonalBestModal";

function OptionGame() {

    const dispatch = useDispatch()

    const [isOpenOption, setIsOpenOption] = React.useState(false)
    const [isOpenBestModal, setIsOpenBestModal] = React.useState(false)
    const [isOpenCustomModal, setIsOpenCustomModal] = React.useState(false)

    const onClickOption = useCallback(() => {
        setIsOpenOption(prevState => !prevState)
    }, [])

    const onClickNew = useCallback(() => {
        dispatch(newGame(''))
    }, [dispatch])

    const onClickLevel = useCallback((e: React.MouseEvent<HTMLButtonElement> & {target: {name: string}}) => {
        const level = Object.keys(GAME_LEVELS).find((level: string) => level === e.target.name) as keyof typeof GAME_LEVELS
        if (level) {
            dispatch(changeLevel(GAME_LEVELS[level]))
        } else {
            setIsOpenCustomModal(true)
        }
        setIsOpenOption(false)
    }, [dispatch])

    const onClickPersonalBest = useCallback(() => {
        setIsOpenBestModal(true)
        setIsOpenOption(false)
    }, [])

    const onClickExit = useCallback(() => {window.close()}, [])

    const optionGameRef = useClickOutside({
        handler: () => {
            setIsOpenOption(false)
        }
    })

    return (
        <header className="option-game" ref={optionGameRef}>
            <LevelCustomModal isOpen={isOpenCustomModal} onClose={() => {setIsOpenCustomModal(false)}} />
            <PersonalBestModal isOpen={isOpenBestModal} onClose={() => {setIsOpenBestModal(false)}} />
            <button className="option-game-button" onClick={onClickOption}>
                Game
            </button>
            {isOpenOption && (
                <div className="option-game-list">
                    <button className="option-game-item" onClick={onClickNew}>New</button>
                    {Object.keys(GAME_LEVELS).concat(["Custom"]).map(level => <button className="option-game-item" name={level} key={level} onClick={onClickLevel}>
                        {level}
                    </button>)}
                    <button className="option-game-item" onClick={onClickPersonalBest}>Personal Best</button>
                    <button className="option-game-item" onClick={onClickExit}>Exit</button>
                </div>
            )}
        </header>
    );
}

export default OptionGame;
