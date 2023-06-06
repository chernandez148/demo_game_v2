import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { Routes, Route } from "react-router-dom";
import { userState, fadeInState, characterState, loadFileState, jobDataState, inventoryDataState } from '../States/States';
import MenuSelection from '../MenuSelection/MenuSelection';
import CharacterCreation from '../CharacterCreation/CharacterCreation';
import Continue from '../Continue/Continue';
import GameMap from '../GameMap/GameMap';
import ItemMenu from '../ItemMenu/ItemMenu';
import './TitleScreen.css'

function TitleScreen() {
    const [user, setUser] = useRecoilState(userState);
    const [fadeIn, setFadeIn] = useRecoilState(fadeInState);
    const [character, setCharacter] = useRecoilState(characterState);
    const [inventoryData, setInventoryData] = useRecoilState(inventoryDataState)
    const [loadFile, setLoadFile] = useRecoilState(loadFileState);
    const [jobData, setJobData] = useRecoilState(jobDataState);
    console.log(inventoryData)

    useEffect(() => {
        mainMenu()
        fetchUser()
        fetchJobStats()
        fetchCharacters()
        fetchInventoryData()
    }, []);

    const mainMenu = () => {
        const MainMenuFadeIn = setTimeout(() => {
            setFadeIn(true);
        }, 10000);

        return () => {
            clearTimeout(MainMenuFadeIn);
        };
    }

    const fetchJobStats = () => {
        fetch("/job_stats")
            .then(resp => resp.json())
            .then(data => setJobData(data))
    }

    const fetchCharacters = () => {
        fetch("/character")
            .then(resp => resp.json())
            .then(data => setCharacter(data))
    }

    const fetchInventoryData = () => {
        fetch("/inventory_data")
            .then(resp => resp.json())
            .then(data => setInventoryData(data))
    }

    const fetchUser = () => {
        fetch("/authorized")
            .then(resp => {
                if (resp.ok) {
                    resp.json()
                        .then(data => {
                            setUser(data)
                        })
                } else {
                    setUser(null)
                }
            })
    }

    const backgroundFadeIn = fadeIn ? "fadeIn" : ""

    const addCharacter = (character) => setCharacter(current => [...current, character])

    const updateUser = (user) => setUser(user)

    return (
        <div className={`TitleScreen h-full ${backgroundFadeIn}`}>
            <Routes>
                <Route exact path="/" element={<MenuSelection user={user} updateUser={updateUser} setFadeIn={setFadeIn} />} />
                <Route exact path="/character_creation" element={<CharacterCreation jobData={jobData} setFadeIn={setFadeIn} addCharacter={addCharacter} />} />
                <Route exact path='/continue' element={<Continue character={character} setFadeIn={setFadeIn} setLoadFile={setLoadFile} />} />
                <Route exact path='/game_map' element={<GameMap inventoryData={inventoryData} setFadeIn={setFadeIn} loadFile={loadFile} />} />
                <Route exact path='/item_menu' element={<ItemMenu setFadeIn={setFadeIn} loadFile={loadFile} />} />
            </Routes>
        </div>
    )
}

export default TitleScreen
