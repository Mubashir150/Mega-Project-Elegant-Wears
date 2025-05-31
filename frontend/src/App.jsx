import { Route,Routes , useLocation} from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import SignUp from "./pages/Signup"
import Home from "./pages/Home"
import SelectedCategory from "./pages/SelectedCategory"
import Details from "./pages/Details"
import CartDrawer from "./components/CartDrawer"
import Navbar from "./components/Navbar"
import Checkout from "./pages/Checkout"
import ResetPassword from "./pages/ResetPassword"
import ForgotPassword from "./pages/ForgotPassword"
import EmailVerification from "./pages/EmailVerification"
import {fetchCart,mergeLocalCartWithBackend} from "./slice/cartSlice"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react"
function App() {
    const location=useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const showNavbar=location.pathname!=="/"

    useEffect(() => {
      
      dispatch(fetchCart());

      
  }, [dispatch]);

  useEffect(() => {
    // 2. When the user object changes (e.g., user logs in or logs out)
    if (user) { // If a user object exists, it means the user is logged in
        
        dispatch(mergeLocalCartWithBackend());
    }
    
}, [user, dispatch]);

  

  return (
    <>
    {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/verify-email" element={<EmailVerification/>}/>
        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/products" element={<Home/>}/>
        <Route path="/products/:category" element={<SelectedCategory/>}/>
        <Route path="/products/:category/:id" element={<Details/>}/>
        <Route path="/products/checkout" element={<Checkout/>}/>
      </Routes>
      <CartDrawer/>
    </>
  )
}

export default App
