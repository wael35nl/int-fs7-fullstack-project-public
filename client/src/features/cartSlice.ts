import { createSlice } from "@reduxjs/toolkit";
import { ProductType } from "pages/products/Products";

const data: ProductType[] = localStorage.getItem('cart') !== null ? JSON.parse(String(localStorage.getItem('cart'))) : [];
const initialState = {
    cartItems: data
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cartItems = [...state.cartItems, action.payload];
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(product => product._id !== action.payload);
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
        }
    }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;