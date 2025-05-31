
import { motion } from "framer-motion";
import Input from "../components/Input";
import { Mail, Lock, Loader } from "lucide-react";
import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slice/authSlice";
import { fetchCart } from "../slice/cartSlice";

export default function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth); 
    const navigate = useNavigate();

    
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/products");
        }
    }, [isAuthenticated, navigate]);

    async function handleLogin(event) {
        event.preventDefault();
        try {
            await dispatch(login({ email, password })).unwrap();
            await dispatch(fetchCart()).unwrap();
            
        } catch (error) {
            console.log("Login error:", error);
        }
    }

    return (
        <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
        
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/p3.jpg')" }}
            ></div>

            
            <div className="absolute inset-0 bg-black opacity-70"></div> 
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='relative z-10 max-w-md w-full bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden' 
            >
                <div className="p-8">
                    <h2 className='text-4xl font-extrabold mb-6 text-center text-white'>
                        Welcome Back!
                    </h2>
                    
                    <p className="text-gray-300 text-center mb-8">Sign in to access your account.</p>

                    <form onSubmit={handleLogin}>
                        <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className='flex justify-end mb-6'> 
                            <Link to='/forgot-password' className='text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200'>
                                Forgot password?
                            </Link>
                        </div>
                        {error && <p className="text-red-400 font-semibold mt-2 text-center">{error}</p>} 
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center'
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className='w-5 h-5 animate-spin' /> : "Login"}
                        </motion.button>
                    </form>
                </div>
                <div className='px-8 py-4 bg-gray-950 bg-opacity-70 flex justify-center border-t border-gray-700'> 
                    <p className='text-sm text-gray-400'>
                        Don't have an account?{" "}
                        <Link to={"/signup"} className='text-blue-400 hover:underline hover:text-blue-300 transition-colors duration-200'>
                            Create an account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}