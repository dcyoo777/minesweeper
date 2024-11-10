import React, {useEffect} from 'react';
import OptionGame from "./OptionGame";
import './Header.scss';
import {useDispatch} from "react-redux";
import {changeLevel} from "../../redux/game";

function Header() {

    const dispatch = useDispatch()

    useEffect(() => {
        const lastLevel = localStorage.getItem('level')
        if (lastLevel) {
            const {width, height, mines} = JSON.parse(lastLevel)
            dispatch(changeLevel({width, height, mines}))
        }
    }, [dispatch]);

    return (
        <header className="header">
            <OptionGame />
        </header>
    );
}

export default Header;
