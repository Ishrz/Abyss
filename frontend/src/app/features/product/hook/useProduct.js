import { createProduct, getSellerProduct , getAllProducts } from "../service/product.api";
import { setSellerProducts , setProducts} from "../state/product.slice";
import { useDispatch } from "react-redux";


const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(formData){
        const data = await createProduct(formData);
        return data.product
    }

    async function handleGetSellerProduct(){
        const data = await getSellerProduct();
        dispatch(setSellerProducts(data.products));
        return data.products
    }

    async function handleGetAllProducts(){
        const data = await getAllProducts();
        dispatch(setProducts(data.products))
        return data.products
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts
    }

}

export default useProduct;  