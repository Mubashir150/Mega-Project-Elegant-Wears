
import {configureStore} from "@reduxjs/toolkit"
import productReducer from "../slice/productSlice"
import productDetailReducer from "../slice/productDetailsSlice"
import cartReducer from "../slice/cartSlice"
import checoutReducer from "../slice/checkoutSlice"
import authReducer from "../slice/authSlice"



export const store=configureStore({
    reducer:{
        products:productReducer,
        productDetail:productDetailReducer,
        cart:cartReducer,
        checkout:checoutReducer,
        auth:authReducer
    },
})