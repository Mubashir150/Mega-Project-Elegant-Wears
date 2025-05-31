// src/components/SignUp.jsx
import { motion } from "framer-motion";
import Input from "../components/Input";
import { Mail, User, Lock, Loader } from "lucide-react";
import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import PasswordMeter from "../components/PasswordMeter";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../slice/authSlice";
import { toast } from "react-hot-toast";

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth); 

    
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/products");
        }
    }, [isAuthenticated, navigate]);

    async function handleSignup(event) {
        event.preventDefault();
        try {
            await dispatch(signup({ email, password, name })).unwrap();
            toast.success("Account created! Please verify your email."); 
            navigate("/verify-email");
        } catch (err) {
            console.error("Signup error:", err);
            toast.error(err.message || "Error creating account."); 
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
                        Create Account
                    </h2>
                    <p className="text-gray-300 text-center mb-8">Join us to explore amazing products!</p> 

                    <form onSubmit={handleSignup}>
                        <Input icon={User} type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <PasswordMeter password={password} />
                        {error && <p className="text-red-400 font-semibold mt-4 text-center">{error}</p>} 

                        <motion.button
                            className='mt-6 w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center' 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Sign up"} 
                        </motion.button>
                    </form>
                </div>
                <div className='px-8 py-4 bg-gray-950 bg-opacity-70 flex justify-center border-t border-gray-700'> 
                    <p className='text-sm text-gray-400'>
                        Already have an account?{" "}
                        <Link to={"/login"} className='text-blue-400 hover:underline hover:text-blue-300 transition-colors duration-200'>
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}