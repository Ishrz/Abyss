import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes.jsx'
import useAuth from './features/auth/hook/useAuth.js'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
function App() {
  const {handleGetMe}=useAuth()

  const user  = useSelector( state => state.auth.user)

  useEffect( ()=>{
    handleGetMe()
  }, [])

  console.log(user)

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
