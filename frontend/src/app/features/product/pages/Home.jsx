import { useSelector } from "react-redux"
import useProduct from "../hook/useProduct"
import { useEffect } from "react"


const Home = () =>{

    const  {handleGetAllProducts} = useProduct()

    const products = useSelector( state => state.product.products)
    
    useEffect( ()=> {
        handleGetAllProducts()
    }, [])

    console.log(products)


    return(
        <>
        <h1>Home pgae</h1>
        </>
    )
}

export default Home