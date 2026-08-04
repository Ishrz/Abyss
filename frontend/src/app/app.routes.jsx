import {createBrowserRouter} from "react-router"
import Register from "./features/auth/pages/Register.jsx"
import Login from "./features/auth/pages/Login.jsx"
import CreateProduct from "./features/product/pages/CreateProduct.jsx"
import Dashboard from "./features/product/pages/Dashboard.jsx"
import Protected from "./features/auth/pages/components/Protected.jsx"
export const routes = createBrowserRouter([
    {
        path:"/",
        element:<h1>Hello </h1>
    },
    {
        path:"/register",
        element:<Register />
    },
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/seller",
        children:[
            {
                path:"/seller/product/create",
                element:<Protected role="seller"> <CreateProduct/> </Protected>
            },
            {
                path:"/seller/product/dashboard",
                element:<Protected role="seller"> <Dashboard/> </Protected>    
            }
        ]
    }
])