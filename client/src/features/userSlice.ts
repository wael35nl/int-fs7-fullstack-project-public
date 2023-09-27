import { createSlice } from '@reduxjs/toolkit';

const isLoggedIn = localStorage.getItem('loginStatus') !== null ? JSON.parse(String(localStorage.getItem('loginStatus'))) : false;

const temporaryData = {user: {_id: '', firstName: '', lastName: '', username: '', age: '', email: '', password: '', phone: '', image: '', is_admin: false, is_banned: false, createdAt: '', updatedAt: '', __v: 0}}

const data = localStorage.getItem('userData') !== null ? JSON.parse(String(localStorage.getItem('userData'))) : temporaryData;

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn,
        userData: data
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            localStorage.setItem('loginStatus', JSON.stringify(state.isLoggedIn));
            state.userData = action.payload;
            localStorage.setItem('userData', JSON.stringify(state.userData));
        },
        update: (state, action) => {
            state.userData = action.payload;
            localStorage.setItem('userData', JSON.stringify(state.userData));
        },
        logout: state => {
            state.isLoggedIn = false;
            localStorage.setItem('loginStatus', JSON.stringify(state.isLoggedIn));
            state.userData = temporaryData;
            localStorage.setItem('userData', JSON.stringify(state.userData));
        }
    }
});

export const { login, update, logout } = userSlice.actions;
export default userSlice.reducer;