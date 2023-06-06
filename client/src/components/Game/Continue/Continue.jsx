import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { CiEdit, CiTrash } from 'react-icons/ci';
import { MdOutlineKeyboardReturn } from 'react-icons/md'
import bg_video from '../../../assets/video/character_creation_screen.mp4'
import './Continue.css'

const sessionStorage = window.sessionStorage;

function Continue({ setFadeIn, character, setLoadFile }) {
    const [continueScreenBG, setContinueScreenBGBG] = useState(false);
    const [newName, setNewName] = useState("")
    const [showEditBox, setShowEditBox] = useState(false)
    console.log(setLoadFile)
    console.log(character)
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            setFadeIn(false);
        }, 1);

        setTimeout(() => {
            setContinueScreenBGBG(true);
        }, 1000);

        const fadeOutTimeout = setTimeout(() => {
            setFadeIn(true);
        }, 1500);

        return () => {
            clearTimeout(fadeOutTimeout);
        };
    }, [setFadeIn]);

    const showContinueScreen = continueScreenBG ? "opacity-1" : "opacity-0";

    const handleFileClick = (id) => {
        setFadeIn(false)
        fetch("/load_file", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
            .then((response) => response.json())
            .then((data) => {
                setLoadFile(data);
                sessionStorage.setItem("character_id", data.id);
                navigate("/game_map");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleEditBox = () => {
        setShowEditBox(true)
    }

    const handleEditBoxClose = () => {
        setShowEditBox(false)
    }

    const handleSubmit = (e) => {
        let update = {
            character_name: newName,
        }
        fetch(`/new_character/1`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(update)
        })
        setShowEditBox(false)
        window.location.reload()
    }

    const handleDelete = () => {
        fetch(`/new_character/1`, {
            method: "DELETE"
        })
        window.location.reload()
    }


    return (
        <div className={`Continue ${showContinueScreen}`}>
            <div className="video-background">
                <video autoPlay loop muted>
                    <source src={bg_video} type="video/mp4" />
                </video>
            </div>
            <div className="p-10">
                <div>
                    <h1 className="text-5xl text-white">Load Saved Data</h1>
                    <div className="savedData">
                        {character.map((characterData) => (
                            <div
                                key={characterData.id}
                                className="border-b-2 savedFile"
                            >
                                <h2 className="text-xl text-white">
                                    {characterData.character_name}
                                </h2>
                                <div className='flex'>
                                    <div className="flex" onClick={() => handleFileClick(characterData.id)}>
                                        {characterData.sex === 'male' ? <img
                                            src={characterData.job_stats.male_job_image}
                                            alt="job_image"
                                            width="50px"
                                            height="50px"
                                        /> : <img
                                            src={characterData.job_stats.female_job_image}
                                            alt="job_image"
                                            width="50px"
                                            height="50px"
                                        />}
                                        <span>LVL: {characterData.job_stats.lvl}</span>
                                    </div>
                                    <div className='edit-delete'>
                                        <span onClick={handleEditBox}><CiEdit /></span>
                                        <span onClick={handleDelete}><CiTrash /></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showEditBox ? <div className='editbox h-full w-full absolute top-0 z-50'>
                <div className="video-background">
                    <video autoPlay loop muted>
                        <source src={bg_video} type="video/mp4" />
                    </video>
                </div>
                <span onClick={handleEditBoxClose}><MdOutlineKeyboardReturn /></span>
                <form onSubmit={handleSubmit} className='edit-form flex items-center px-14 py-20'>
                    <div>
                        {character.map((characterData) => (

                            characterData.sex === 'male' ? <img
                                src={characterData.job_stats.male_job_image}
                                alt="job_image"
                                width="50px"
                                height="50px"
                            /> : <img
                                src={characterData.job_stats.female_job_image}
                                alt="job_image"
                                width="50px"
                                height="50px"
                            />
                        ))}
                    </div>
                    <div className='ps-5 flex flex-col'>
                        <label htmlFor="username">USERNAME</label>
                        <input onChange={(e) => setNewName(e.target.value)} type="text" placeholder='Change Username' className='username-input' value={newName} />
                    </div>
                    <button className='flex w-full justify-end' type='submit'>Confirm</button>
                </form>
            </div> : ""}
        </div>
    );
}

export default Continue;
