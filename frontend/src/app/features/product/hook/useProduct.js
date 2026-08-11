import { createProduct, getSellerProduct , getAllProducts , getProductDetails, getsellerProductDetails, addProductVariant, updateProductVariant, deleteProductVariant } from "../service/product.api";
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

    async function handleGetSellerProdcutDetais(productId){
        const data = await getsellerProductDetails(productId)
        return data.product
    }

    async function handleAddProductVariant(productId, formData){
        const data = await addProductVariant(productId, formData)
        return data.product
    }

    async function handleUpdateProductVariant(productId, variantId, stock){
        const data = await updateProductVariant(productId, variantId, stock)
        return data.product
    }

    async function handleDeleteProductVariant(productId, variantId){
        const data = await deleteProductVariant(productId, variantId)
        return data.product
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleProductDetails,
        handleGetSellerProdcutDetais,
        handleAddProductVariant,
        handleUpdateProductVariant,
        handleDeleteProductVariant
    }

}

export default useProduct;  