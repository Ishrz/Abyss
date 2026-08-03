import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlcie({
    name:"product",
    initialState:{
        sellerProducts:[],
    },
    reducers:{
        setSellerProducts:(state,action)=>{
            state.sellerProducts = action.payload
        }
    }
})

export const {setSellerProducts} = productSlice.actions;

export default productSlice.reducer