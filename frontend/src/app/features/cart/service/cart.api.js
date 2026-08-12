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

export const getCart = async ()=>{
    const response = await cartApiInstance.get("/")
    return response.data
}