import {setUser,setLoading,setError} from "../state/auth.slice.js"
import { register, login } from "../service/auth.api.js"
import { useDispatch } from "react-redux"



const useAuth = () =>{
const dipstach = useDispatch()

const handleRegister = async ({fullname,contact,email,password,isSeller}) =>{

    const data = await register({fullname,contact,email,password,isSeller})
    dipstach(setUser(data.user))
    return data

}

const handleLogin = async ({email,password}) => {

    const data = await login({email,password})
    dipstach(setUser(data.user))
    return data

}



return {
    handleRegister,
    handleLogin
}

}

export default useAuth