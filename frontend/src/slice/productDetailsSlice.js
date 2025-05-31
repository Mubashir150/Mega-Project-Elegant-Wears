import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductId=createAsyncThunk("productDetail/fetchProductId",async({category,id})=>{
    const response=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/${category}/${id}`);
    return response.data;
});

const productDetailSlice=createSlice({
    name:"productDetail",
    initialState:{
        product:null,
        status:"idle",
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProductId.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchProductId.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.product = action.payload;
        })
        .addCase(fetchProductId.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
    }
})

export default productDetailSlice.reducer;