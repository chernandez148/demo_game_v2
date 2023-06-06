import React, { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import './Credits.css';

const fadeState = atom({
    key: 'fadeState',
    default: false,
});

const secondFadeState = atom({
    key: 'secondFadeState',
    default: false,
});

function Credits() {
    const [fade, setFade] = useRecoilState(fadeState);
    const [secondFade, setSecondFade] = useRecoilState(secondFadeState);

    useEffect(() => {
        setTimeout(() => {
            setFade(true);
        }, 2000);

        setTimeout(() => {
            setFade(false);
        }, 4000);

        setTimeout(() => {
            setSecondFade(true);
        }, 6000);

        const fadeOutTimeout = setTimeout(() => {
            setSecondFade(false);
        }, 8000);

        return () => {
            clearTimeout(fadeOutTimeout);
        };
    }, [setFade, setSecondFade]);

    const fadeIn = fade === true ? 'fade-in' : 'fade-out';
    const secondFadeIn = secondFade === true ? 'fade-in' : 'fade-out';

    return (
        <div className="Credits h-full w-full flex items-center justify-center text-white absolute">
            <h6 className={`absolute ${fadeIn}`}>Designed and Engineered by Christian Hernandez</h6>
            <h6 className={`absolute ${secondFadeIn}`}>Enjoy</h6>
        </div>
    );
}

export default Credits;
