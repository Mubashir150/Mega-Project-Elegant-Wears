// src/components/ResetPassword.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock, Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../slice/authSlice";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { isLoading, message, error } = useSelector((state) => state.auth);
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!"); 
            return;
        }
        try {
            await dispatch(resetPassword({ token, password })).unwrap();
            toast.success("Password Reset Successfully");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Reset password error:", error); 
            toast.error(error.message || "Error resetting password");
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
                <div className='p-8'>
                    <h2 className='text-4xl font-extrabold mb-6 text-center text-white'> 
                        Reset Password
                    </h2>
                    <p className="text-gray-300 mb-6 text-center">
                        Enter your new password below.
                    </p>

                    {error && <p className='text-red-400 text-sm mb-4 text-center'>{error}</p>} 
                    {message && <p className='text-green-400 text-sm mb-4 text-center'>{message}</p>} 

                    <form onSubmit={handleSubmit}>
                        <Input
                            icon={Lock}
                            type='password'
                            placeholder='New Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Input
                            icon={Lock}
                            type='password'
                            placeholder='Confirm New Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center' 
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className='w-5 h-5 animate-spin' /> : "Set New Password"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default ResetPassword;