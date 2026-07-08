import axios from "axios"

const authApiInctance = axios.create({
    baseURL:"http://localhost:3000/api/v1/auth",
    withCredentials:true
})


export const register = async ({fullname,contact,email,password,isSeller})=>{

    const response = await authApiInctance.post("/register",{
        fullname,contact,email,password,isSeller
    })

    return response.data

}

export const login = async ({email,password})=>{

    const response = await authApiInctance.post("/login",{
        email,password
    })

    return response.data

}