import { createProduct, getSellerProduct , getAllProducts , getProductDetails } from "../service/product.api";
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

    async function handleProductDetails(productId){
        const data = await getProductDetails(productId)
        return data.product
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleProductDetails
    }

}

export default useProduct;  