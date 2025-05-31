import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../slice/authSlice";
import {Loader } from "lucide-react"; 

const EmailVerification = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const handleChange = (index, value) => {
        const newcode = [...code];
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newcode[i] = pastedCode[i] || "";
            }
            setCode(newcode);

            const lastfilledindex = newcode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastfilledindex < 5 ? lastfilledindex + 1 : 5;
            inputRefs.current[focusIndex]?.focus();
        } else {
            newcode[index] = value;
            setCode(newcode);
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");
        try {
            await dispatch(verifyEmail(verificationCode)).unwrap();
            navigate("/products");
            toast.success("Email verified successfully");
        } catch (err) {
            console.log("Verification failed:", err);
            
        }
    };

    // Auto Submit
    useEffect(() => {
        if (code.every(digit => digit !== "")) {
            if (!isLoading) {
                handleSubmit(new Event("submit"));
            }
        }
    }, [code, isLoading]);

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
                        Verify Your Email
                    </h2>
                    <p className="text-center text-gray-300 mb-6 text-base sm:text-lg">Enter the 6-digit code sent to your email address.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center space-x-2 sm:space-x-3">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type='text'
                                    maxLength='1'
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    
                                    className='w-10 h-10 sm:w-12 sm:h-12 text-center text-xl sm:text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200'
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            ))}
                        </div>
                        {error && <p className="text-red-400 font-semibold mt-4 text-center">{error}</p>}
                        <motion.button
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }}  
                            type='submit'
                            disabled={isLoading || code.some((digit) => !digit)}
                            
                            className='w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center'
                        >
                            {isLoading ? <Loader className='w-5 h-5 animate-spin mr-2' /> : "Verify Email"} 
                        </motion.button>
                    </form>
                </div>
                
            </motion.div>
        </div>
    );
};

export default EmailVerification;