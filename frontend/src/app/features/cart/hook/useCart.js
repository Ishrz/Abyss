import { addToCart, getCart } from "../service/cart.api";
import { setCart, addCart } from "../state/cart.slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";


const useCart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const { cartItems } = useSelector((state) => state.cart)


    const handleAddToCart = async ({ productId, variantId }) => {
        try {
            const data = await addToCart({ productId, variantId })
            dispatch(addCart(data.cart))

        } catch (error) {
            console.log(error)

        }
    }

    const handleGetCart = async () => {
        try {
            const data = await getCart()
            dispatch(setCart(data.cart))
        } catch (error) {
            console.log(error)

        }
    }

    return {
        handleAddToCart,
        handleGetCart
    }
}


export default useCart