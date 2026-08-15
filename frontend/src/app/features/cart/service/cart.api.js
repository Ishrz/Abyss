import axios from "axios"

const cartApiInstance = axios.create({
    baseURL:"/api/v1/cart",
    withCredentials:true
})


export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    const url = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`
    const response = await cartApiInstance.post(url, {
        quantity
    })
    return response.data
}

export const updateCartItem = async ({ productId, variantId, quantity }) => {
    const url = variantId ? `/update/${productId}/${variantId}` : `/update/${productId}`
    const response = await cartApiInstance.patch(url, {
        quantity
    })
    return response.data
}

export const removeFromCart = async ({ productId, variantId }) => {
    const url = variantId ? `/remove/${productId}/${variantId}` : `/remove/${productId}`
    const response = await cartApiInstance.delete(url)
    return response.data
}

export const getCart = async ()=>{
    const response = await cartApiInstance.get("/")
    return response.data
}

export const createPaymentOrder = async()=>{
    const response = await cartApiInstance.post("/payment/create/order")
    return response.data
}