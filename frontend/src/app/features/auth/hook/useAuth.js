import {setUser,setLoading,setError} from "../state/auth.slice.js"
import { register, login, getMe } from "../service/auth.api.js"
import { useDispatch } from "react-redux"



const useAuth = () =>{
const dispatch = useDispatch()

const handleRegister = async ({fullname,contact,email,password,isSeller}) =>{

    const data = await register({fullname,contact,email,password,isSeller})
    dispatch(setUser(data.user))
    return data

}

const handleLogin = async ({email,password}) => {

    const data = await login({email,password})
    dispatch(setUser(data.user))
    return data

}

 const handleGetMe = async () => {
    try{

    dispatch(setLoading(true))
    const data = await getMe()
    dispatch(setUser(data.user))
    return data.user
    
}catch(err){
    console.log(err)
    dispatch(setError(err))
}finally{
    dispatch(setLoading(false))
    }
}



return {
    handleRegister,
    handleLogin,
    handleGetMe
}

}

export default useAuth