import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
const API_URL="http://localhost:3000";


export const fetchProducts=createAsyncThunk("products/fetchProducts", async({category="All", sort=""})=>{
    let endpoint=`${API_URL}/products`;
    if(category && category!=="All"){
        endpoint=`${API_URL}/products/${category}`
    }

    const params={};
    if(sort){
        params.sort=sort;
    }
    const response= await axios.get(endpoint,{params:params,withCredentials:true});
    return response.data;
});

const productSlice=createSlice({
    name:"products",
    initialState:{
        items:[],
        status:"idle",
        error:null,
        category:"All"
    },
    reducers:{
        setCategory:(state,action)=>{
            state.category=action.payload
        },
        
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchProducts.pending,(state)=>{
            state.status="loading"
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.items = action.payload;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
        
    }
})

export const {setCategory,sortProducts}=productSlice.actions;
export default productSlice.reducer;