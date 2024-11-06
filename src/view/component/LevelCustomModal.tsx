import React, {useCallback, useState} from 'react';
import './LevelCustomModal.scss';
import cn from "classnames";
import Modal from "../component-library/modal/Modal";
import useEditContent from "../../hook/useEditContent";
import {useDispatch, useSelector} from "react-redux";
import {changeLevel, selectGame} from "../../redux/game";

type LevelCustomModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

const CUSTOM_LEVEL_PROPS = ["width", "height", "mines"] as const;

function LevelCustomModal({isOpen, onClose}: LevelCustomModalProps) {

    const dispatch = useDispatch();

    const game = useSelector(selectGame);

    const [content, setContent] = useState<{
        width: number,
        height: number,
        mines: number
    }>({
        width: game.width,
        height: game.height,
        mines: game.mines
    });

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setContent({...content, [e.target.name]: parseInt(e.target.value)})
    }, [content, setContent])

    const onSave = useCallback(() => {
        dispatch(changeLevel(content))
        onClose()
    }, [content, dispatch, onClose])

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="level-custom-modal">
            <h2>Custom Level</h2>

            <div className={"level-custom-modal-body"}>
                {CUSTOM_LEVEL_PROPS.map(prop => (
                    <div key={prop} className={"level-custom-modal-row"}>
                        <label className={"level-custom-modal-row-label"}>{prop}</label>
                        <input className={"level-custom-modal-row-input"} type="number" name={prop} value={content[prop].toString()} onChange={onChange} min={0} max={100}/>
                    </div>
                ))}
            </div>

            <div className={"level-custom-modal-button-wrapper"}>
                <button className={"level-custom-modal-button cancel"} onClick={onClose}>Cancel</button>
                <button className={"level-custom-modal-button save"} onClick={onSave}>Save</button>
            </div>
        </Modal>
    );
}

export default LevelCustomModal;
