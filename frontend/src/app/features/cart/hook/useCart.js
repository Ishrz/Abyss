import { addToCart, getCart, updateCartItem, removeFromCart } from "../service/cart.api";
import { setCart } from "../state/cart.slice";
import { useDispatch } from "react-redux";


const useCart = () => {
    const dispatch = useDispatch()


    const handleAddToCart = async ({ productId, variantId }) => {
        const data = await addToCart({ productId, variantId })
        dispatch(setCart(data.cart))
        return data.cart
    }

    const handleGetCart = async () => {
        const data = await getCart()
        dispatch(setCart(data.cart))
        return data.cart
    }

    const handleUpdateQuantity = async ({ productId, variantId, quantity }) => {
        const data = await updateCartItem({ productId, variantId, quantity })
        dispatch(setCart(data.cart))
        return data.cart
    }

    const handleRemoveItem = async ({ productId, variantId }) => {
        const data = await removeFromCart({ productId, variantId })
        dispatch(setCart(data.cart))
        return data.cart
    }

    return {
        handleAddToCart,
        handleGetCart,
        handleUpdateQuantity,
        handleRemoveItem
    }
}


export default useCart