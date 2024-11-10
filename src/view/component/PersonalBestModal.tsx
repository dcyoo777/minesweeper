import React, {useEffect, useState} from 'react';
import './PersonalBestModal.scss';
import Modal from "../component-library/modal/Modal";
import {GAME_LEVELS} from "../../redux/game";

type LevelCustomModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

function PersonalBestModal({isOpen, onClose}: LevelCustomModalProps) {

    const [record, setRecord] = useState<any>({});

    useEffect(() => {
        setRecord(Object.keys(GAME_LEVELS).reduce((res, level) => {
            return {
                ...res,
                [level]: localStorage.getItem(level) ?? 9999
            }
        }, {}))
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="personal-best-modal">
            <h2>Personal Best</h2>

            <div className={"personal-best-modal-body"}>
                {Object.keys(record).map((level) => (
                    <div key={level} className={"personal-best-modal-row"}>
                        <label className={"personal-best-modal-row-label"}>{level}</label>
                        <span className={"personal-best-modal-row-value"}>{record[level]} seconds</span>
                    </div>
                ))}
            </div>

            <div className={"personal-best-modal-button-wrapper"}>
                <button className={"personal-best-modal-button cancel"} onClick={onClose}>Close</button>
            </div>
        </Modal>
    );
}

export default PersonalBestModal;
