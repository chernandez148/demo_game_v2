import { atom, selector } from 'recoil';

export const userState = atom({
    key: 'userState',
    default: null,
});

export const fadeInState = atom({
    key: 'fadeInState',
    default: false,
});

export const fadeInMenuState = atom({
    key: 'fadeInMenuState',
    default: false,
});

export const characterState = atom({
    key: 'characterState',
    default: [],
});

export const loadFileState = atom({
    key: 'loadFileState',
    default: null,
});

export const jobDataState = atom({
    key: 'jobDataState',
    default: [],
});

export const loginState = atom({
    key: 'loginState',
    default: false,
});

export const hideState = atom({
    key: 'hideState',
    default: false,
});

export const inventoryDataState = atom({
    key: 'inventoryDataState',
    default: [],
})

export const hasUser = selector({
    key: 'hasUser',
    get: ({ get }) => {
        const user = get(userState);
        return user !== null;
    },
});

// ... add more selectors as needed
