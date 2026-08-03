import { createProduct, getSellerProduct } from "../service/product.api";
import { setSellerProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";


const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(formData){
        const data = await createProduct(formData);
        return data.product
    }

    async function handleGetSellerProduct(){
        const data = await getSellerProduct();
        dispatch(setSellerProducts(data.product));
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
    }

}

export default useProduct;  