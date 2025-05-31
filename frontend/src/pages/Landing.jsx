import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        navigate("/login");
    };

    const handleSignup = (event) => {
        event.preventDefault();
        navigate("/signup");
    };

    const handleProduct = (event) => {
        event.preventDefault();
        navigate("/products");
    };

    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, 
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95 },
    };

    return (
        <>
            <motion.section
                className="relative h-screen overflow-hidden flex flex-col justify-center items-center text-white bg-gradient-to-br from-gray-900 to-black"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <img
                    src="images/p2.jpg"
                    alt="Fashion background"
                    className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-75"
                />
                
               
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div> 

                
                <motion.nav
                    className="absolute inset-x-0 top-0 flex justify-between items-center py-6 px-8 lg:px-20 z-50 bg-gradient-to-b from-black/80 to-transparent" 
                    variants={itemVariants}
                >
                    <motion.h1
                        className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-md"
                        variants={itemVariants}
                    >
                        Elegant Wears
                    </motion.h1>
                    <motion.div className="flex items-center space-x-4 lg:space-x-6" variants={itemVariants}>
                        <motion.button
                            className="px-6 py-2 lg:px-8 lg:py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-full shadow-lg transition-all text-base lg:text-lg font-semibold tracking-wide hover:from-blue-600 hover:to-blue-800"
                            onClick={handleLogin}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Login
                        </motion.button>
                        <motion.button
                            className="px-6 py-2 lg:px-8 lg:py-3 bg-gray-700 text-gray-200 rounded-full shadow-lg transition-all text-base lg:text-lg font-semibold tracking-wide hover:bg-gray-600"
                            onClick={handleSignup}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Sign Up
                        </motion.button>
                    </motion.div>
                </motion.nav>

                
                <div className="relative z-20 text-center flex flex-col items-center justify-center h-full px-4">
                    <motion.h2
                        className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-gray-300 drop-shadow-lg"
                        variants={itemVariants}
                    >
                        Unleash Your Unique Style
                    </motion.h2>
                    <motion.p
                        className="text-lg lg:text-1xl text-gray-300 mb-10 max-w-2xl"
                        variants={itemVariants}
                    >
                        Discover the finest collection of apparel and accessories that define elegance and comfort.
                    </motion.p>
                    <motion.button
                        className="px-10 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full shadow-2xl transition-all text-xl font-bold tracking-wider hover:from-green-400 hover:to-teal-500 transform hover:scale-105"
                        onClick={handleProduct}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Shop the Collection
                    </motion.button>

                    
                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 text-black py-3 px-6 rounded-lg shadow-xl text-lg font-bold z-30 transform hover:scale-105 transition-transform duration-300"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { delay: 1, type: "spring", stiffness: 100 } }}
                    >
                        🎉 Get 15% OFF on Creating an Account Today!
                    </motion.div>
                </div>
            </motion.section>

            
            <motion.section
                className="flex flex-col lg:flex-row items-center justify-center py-20 px-8 lg:px-20  text-gray-200 gap-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="max-w-xl text-center lg:text-left"
                    variants={itemVariants}
                >
                    <h1 className="text-4xl font-bold mb-6 text-white leading-tight">
                        Why Your Style Matters: The Confidence Connection
                    </h1>
                    <p className="text-lg leading-relaxed text-gray-400">
                        Beyond just looking good, the right style can profoundly impact your confidence, mood, and how you interact with the world. We believe that when you feel great in what you wear, you're empowered to achieve more.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mt-4">
                        Explore our curated collections designed to enhance your personal expression and elevate your presence, effortlessly.
                    </p>
                </motion.div>
                <motion.div
                    className="flex-shrink-0"
                    variants={itemVariants}
                >
                    <img
                        src="images/download (1).jpeg"
                        alt="Styling for confidence"
                        className="w-full max-w-md h-auto rounded-xl shadow-2xl object-cover transform hover:scale-102 transition-transform duration-300"
                    />
                </motion.div>
            </motion.section>
            <motion.section
                className="relative h-96 flex flex-col items-center justify-center text-center text-white p-8 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: true, amount: 0.4 }} 
            >
                
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed" 
                    style={{ backgroundImage: `url('images/p1.jpg')` }} 
                >
                    
                    <div className="absolute inset-0 bg-black opacity-70"></div>
                </div>

                
                <div className="relative z-10 max-w-3xl">
                    <motion.h2
                        className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg"
                        variants={itemVariants}
                    >
                        Experience True Elegance
                    </motion.h2>
                    <motion.p
                        className="text-lg lg:text-xl text-gray-300 mb-8"
                        variants={itemVariants}
                    >
                        Browse our exclusive collections, hand-picked for quality and timeless appeal. Find pieces that speak to you.
                    </motion.p>
                    <motion.button
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-full shadow-lg transition-all text-lg font-bold tracking-wide hover:from-purple-500 hover:to-indigo-600 transform hover:scale-105"
                        onClick={handleProduct} 
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Start Your Journey
                    </motion.button>
                </div>
            </motion.section>

            
            <footer className="bg-black py-8 text-gray-500 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Elegant Wears. All rights reserved.</p>
                <p className="mt-2">Designed with passion for style and comfort.</p>
            </footer>
        </>
    );
}


