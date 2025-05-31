// src/components/Navbar.jsx
import { ShoppingBasket } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCartDrawer } from "../slice/cartSlice"; 
import { Link, useNavigate } from "react-router-dom"; 
import { logout, checkAuth } from '../slice/authSlice'; 
import { useEffect } from 'react';
import { clearCartLocal } from "../slice/cartSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const cartItemsCount = useSelector((state) => state.cart.items?.length);
    const navigate = useNavigate(); 

    
    const { isAuthenticated, user, isCheckingAuth } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            dispatch(clearCartLocal())
            navigate('/login'); 
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    // Effect to check authentication status on component mount
    useEffect(() => {
        
            
            if (!isCheckingAuth && !isAuthenticated && !user) {
                dispatch(checkAuth())
            }
        

        
    }, [dispatch, isCheckingAuth]);
    
   

    return (
        <nav className="h-20 bg-black flex justify-between items-center px-8 shadow-md">
            <div>
                <Link to="/" className="text-2xl font-bold text-white tracking-wide">Elegant Wears</Link>
            </div>
            <div className="flex items-center space-x-4"> 
                {isAuthenticated ? (
                    <>
                        <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
                        {user && <span className="text-white">Hi, {user.name?.split(' ')[0]|| user.email || 'User'}</span>} 
                        <button
                            onClick={handleLogout}
                            className="text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md transition duration-200"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                       
                        <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
                        <Link
                            to="/login"
                            className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md transition duration-200"
                        >
                            Login
                        </Link>
                    </>
                )}
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => dispatch(toggleCartDrawer())}>
                    <ShoppingBasket className="text-white w-6 h-6" />
                    <h1 className="text-white text-lg font-medium">Cart ({cartItemsCount})</h1>
                </div>
            </div>
        </nav>
    );
}