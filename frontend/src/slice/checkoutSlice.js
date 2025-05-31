import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL=`${import.meta.env.VITE_API_BASE_URL}`;

export const placeOrder=createAsyncThunk("checkout/placeOrder",async(orderDetails,{dispatch,rejectWithValue})=>{
    try{
        const response= await axios.post(`${API_URL}/products/checkout`, orderDetails,{
            withCredentials:true
        })
        return response.data;

    }
    catch(error){
        if(error.response && error.response.data){
            return rejectWithValue(error.response.data.msg||"Failed to place order")
        }
        return rejectWithValue(error.message || 'Network error.')
    }
})

const checkoutSlice=createSlice({
    name:"checkout",
    initialState:{
        order:null,
        orderStatus:"idle",
        orderError:null,
        
    },
    reducers:{
        resetCheckout:(state)=>{
            state.order=null;
            state.orderStatus="idle";
            state.orderError=null
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(placeOrder.pending,(state)=>{
            state.orderStatus="pending";
            state.orderError=null
            state.order = null; 
        }),
        builder.addCase(placeOrder.fulfilled,(state)=>{
            state.orderStatus="succeeded";
            state.orderError=null
            state.order = null; 

        }),
        builder.addCase(placeOrder.rejected,(state,action)=>{
            state.orderStatus="failed"
            state.orderError=action.payload||action.error.message
            state.order = null; 
        })
    }
})

export const {resetCheckout}=checkoutSlice.actions;
export default checkoutSlice.reducer;