import { createSlice } from "@reduxjs/toolkit"


const cartSlice = createSlice({
    name:"cart",
    initialState:{
        items:[]
    },
    reducers:{
        setCart: (state,action) =>{
            state.items = action.payload
        },
        addCart: (state,action) =>{
            state.items.push(action.payload)
        }

    }

})

export const {setCart,addCart} = cartSlice.actions

export default cartSlice