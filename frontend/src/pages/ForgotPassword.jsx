// src/components/ForgotPassword.jsx
import { motion } from "framer-motion"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword} from "../slice/authSlice";
import { ArrowLeft, Loader, Mail } from "lucide-react"
import Input from "../components/Input"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  const [email,setEmail]=useState("")
  const [submitted,setSubmitted]=useState(false)
    const dispatch=useDispatch();
  const {isLoading}=useSelector((state)=>state.auth)

  async function handleSubmit(e){
    e.preventDefault();
    await dispatch(forgotPassword(email));
    setSubmitted(true)
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
            Forgot Password
          </h2>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <p className='text-gray-300 mb-6 text-center'>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Input
                icon={Mail}
                type='email'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center'
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? <Loader className='w-5 h-5 animate-spin' /> : "Send Reset Link"}
              </motion.button>
            </form>
          ) : (
            <div className='text-center'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4' 
              >
                <Mail className='h-8 w-8 text-white' />
              </motion.div>
              <p className='text-gray-300 mb-6'>
                If an account exists for **{email}**, you will receive a password reset link shortly.
              </p>
            </div>
          )}
        </div>
        <div className='px-8 py-4 bg-gray-950 bg-opacity-70 flex justify-center border-t border-gray-700'>
          <Link to={"/login"} className='text-sm text-blue-400 hover:underline hover:text-blue-300 flex items-center transition-colors duration-200'>
            <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword