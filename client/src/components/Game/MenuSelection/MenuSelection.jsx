import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Outlet } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { userState, hideState, fadeInMenuState, fadeInState, loginState } from '../States/States';
import LoginForm from '../LoginForm/LoginForm'
import './MenuSelection.css'

function MenuSelection() {
    const [fadeMenuIn, setFadeMenuIn] = useRecoilState(fadeInMenuState);
    const [fadeIn, setFadeIn] = useRecoilState(fadeInState);
    const [login, setLogin] = useRecoilState(loginState);
    const [hide, setHide] = useRecoilState(hideState);
    const [user, setUser] = useRecoilState(userState);
    const [characterSelectBG, setCharacterSelectBG] = useState(false);
    const navigate = useNavigate();

    const handleFade = () => {
        setFadeMenuIn(true);
    };

    const handleFadeOut = () => {
        setFadeMenuIn(false);
    };

    const handleLogIn = () => {
        setLogin(true);
    };

    const handleSignUp = () => {
        setLogin(false);
    };

    const handleCharacterScreen = () => {
        setCharacterSelectBG(true);
        setFadeIn(false);
    };

    const logout = () => {
        setHide(false);
        setFadeMenuIn(false);

        fetch("/logout", {
            method: "DELETE",
        }).then(res => {
            if (res.ok) {
                setUser(null);
                navigate('/');
            }
        });
    };

    const showTitle = !user ? "opacity-0" : ""

    return (
        <div className='MenuSelection h-full flex items-end text-white pl-14 pb-14'>
            <nav>
                <ul>
                    <li>
                        {!user ? (
                            <Link onClick={() => { handleFade(); handleLogIn(); }}>Log In</Link>
                        ) : (
                            <Link onClick={handleCharacterScreen} to="/character_creation">Demo</Link>
                        )}
                    </li>
                    <li>
                        {!user ? (
                            <Link onClick={() => { handleFade(); handleSignUp() }}>Sign Up</Link>
                        ) : (
                            <Link onClick={handleCharacterScreen} to="/continue">Continue?</Link>
                        )}
                    </li>
                    {user && (
                        <li>
                            <Link onClick={logout}>Log Out</Link>
                        </li>
                    )}
                </ul>
            </nav>
            {user ? <h1 className={`titleFont text-7xl flex w-full h-full justify-center h-full items-center ${showTitle}`}>Callestrae, <h1 className={`demo-font text-4xl ps-4 pt-10`}>demo</h1></h1> : ""}
            <Outlet />
            <LoginForm login={login} fadeMenuIn={fadeMenuIn} handleFadeOut={handleFadeOut} hide={hide} setHide={setHide} updateUser={setUser} />
        </div>
    );
}

export default MenuSelection;
