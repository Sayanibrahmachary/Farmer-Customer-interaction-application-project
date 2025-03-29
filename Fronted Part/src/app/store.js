import {configureStore} from '@reduxjs/toolkit';
import  cartReducer  from "../features/todo/addCart.js";


export const store=configureStore({
    reducer: {
        cart: cartReducer
    }
})