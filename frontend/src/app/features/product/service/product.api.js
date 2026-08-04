import axios from "axios"

const productApiInctance= axios.create({
    baseURL:"/api/v1/product",
    withCredentials:true
})


export const  createProduct = async (formData) =>{
    const response = await productApiInctance.post("/" , formData)
    return response.data
}

export const  getSellerProduct = async ()=> {
    const response =  await productApiInctance.get("/seller/products")
    return response.data
}