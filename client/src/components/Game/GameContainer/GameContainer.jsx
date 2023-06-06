import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Credits from '../Credits/Credits'
import TitleScreen from '../TitleScreen/TitleScreen';
import './GameContainer.css'

function GameContainer() {
    return (
        <div className='GameContainer'>
            <Credits />
            <BrowserRouter>
                <TitleScreen />
            </BrowserRouter>
        </div>
    )
}

export default GameContainer