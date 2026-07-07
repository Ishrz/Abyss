import {setUser,setLoading,setError} from "../state/auth.slice.js"
import { register } from "../service/auth.api.js"
import { useDispatch } from "react-redux"



const useAuth = () =>{
const dipstach = useDispatch()

const handleRegister = async ({fullname,contact,email,password,isSeller=false}) =>{

    const data = await register({fullname,contact,email,password,isSeller})
    dipstach(setUser(data.user))
    return data

}



return {
    handleRegister
}

}