import { useParams } from "react-router"
import useProduct from "../hook/useProduct"
import { useEffect, useState } from "react"


const SellerProdcutDetails = ()=>{
    const {productId} = useParams()
    const {handleGetSellerProdcutDetais,status} = useProduct()
    const [product,setProduct] = useState(null)
    const [loading,setLoading] = useState(true)
    
    const fecthProductDetail = async()=>{
            const data = await handleGetSellerProdcutDetais(productId)
            setProduct(data)
            setLoading(false)
        }
    
    useEffect(()=>{
        fecthProductDetail()
    },[productId])
    // console.log(product)
    return(
        <>
        <h1>Seller product details</h1>
        </>
        
    )
}

export default SellerProdcutDetails