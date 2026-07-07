import axios from "axios"

const registerApi = axios.create({
    baseURL:"http://localhost:3000/api/v1/auth",
    withCredentials:true
})


export const register = async ({email,password,fullname,contact,isSeller})=>{

    const response = await registerApi.post("register",{
        email,password,contact,fullname,isSeller
    })

    return response.data

}