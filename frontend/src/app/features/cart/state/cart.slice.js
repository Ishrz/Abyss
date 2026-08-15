import { createSlice } from "@reduxjs/toolkit"

const computeTotals = (items = []) => {
    const totalPrice = items.reduce((sum, item) => sum + (Number(item?.price?.amount) || 0) * (item?.quantity || 1), 0)
    const currency = items.find(item => item?.price?.currency)?.price?.currency
        || items.find(item => item?.product?.price?.currency)?.product?.price?.currency
        || "INR"
    return { totalPrice, currency }
}

const normalizeCart = (cart) => {
    const items = Array.isArray(cart?.items) ? cart.items : []
    const computed = computeTotals(items)
    return {
        _id: cart?._id || null,
        items,
        totalPrice: typeof cart?.totalPrice === "number" ? cart.totalPrice : computed.totalPrice,
        currency: cart?.currency || computed.currency
    }
}

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        _id: null,
        items: [],
        totalPrice: 0,
        currency: "INR"
    },
    reducers: {
        setCart: (state, action) => normalizeCart(action.payload),
        addCart: (state, action) => {
            state.items.push(action.payload)
            const computed = computeTotals(state.items)
            state.totalPrice = computed.totalPrice
            state.currency = computed.currency
        }
    }
})

export const { setCart, addCart } = cartSlice.actions

export default cartSlice
