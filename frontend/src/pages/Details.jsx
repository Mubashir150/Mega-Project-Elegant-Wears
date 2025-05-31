import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProductId } from "../slice/productDetailsSlice";
import { addToCart } from "../slice/cartSlice";
import SizeChartModal from "../components/SizeChartModal";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ShoppingCart, Ruler } from "lucide-react";

export default function Details() {
    const { category, id } = useParams();
    const dispatch = useDispatch();
    const { status, error, product } = useSelector((state) => state.productDetail);
    const { items: cartItems } = useSelector((state) => state.cart);

    const [sizeChartOpen, setSizeChartOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState(''); 
    const [quantity, setQuantity] = useState(1); 
    const [addedToCartLocal, setAddedToCartLocal] = useState(false);

    useEffect(() => {
        if (product && cartItems.some(item => item.productId === product._id)) {
            setAddedToCartLocal(true);
        } else {
            setAddedToCartLocal(false);
        }
    }, [product, cartItems]);

    function handleAddtoCart() {
        if (!product) return;

        // **IMPORTANT VALIDATION:** Check if a size is required and selected

        if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
            toast.error("Please select a size.");
            return; // Stop the function if no size is selected for a product that has sizes
        }

        const itemToAdd = {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.imageUrl,
            quantity: quantity,
            size: selectedSize 
        };

        dispatch(addToCart(itemToAdd));
        toast.success(`${quantity} x ${product.name} added to cart!`);
        setAddedToCartLocal(true);
    }

    useEffect(() => {
        dispatch(fetchProductId({ category, id }));
        setAddedToCartLocal(false);
        // Reset selected size and quantity when a new product is loaded
        setSelectedSize('');
        setQuantity(1);
    }, [id, category, dispatch]);

    const handleOpenSizeChart = () => {
        setSizeChartOpen(true);
    };

    const handleCloseSizeChart = () => {
        setSizeChartOpen(false);
    };

   

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-xl font-medium text-gray-400"
                >
                    Loading product details...
                </motion.p>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-xl font-medium text-red-500"
                >
                    Error loading product: {error}
                </motion.p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <p className="text-center text-xl font-medium text-gray-400">Product not found.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            {product && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl w-full mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-700"
                >
                    <div className="md:w-1/2 p-4 flex items-center justify-center bg-gray-900 rounded-l-2xl">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="max-h-[500px] w-full object-contain rounded-lg shadow-md"
                        />
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-wide">{product.name}</h1>
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">{product.description}</p>

                            <p className="text-4xl font-bold text-blue-400 mb-6">${product.price}</p>

                           
                            {product.availableSizes && product.availableSizes.length > 0 && (
                                <div className="mb-6">
                                    <label htmlFor="size-select" className="block text-gray-300 text-lg font-semibold mb-3">
                                        Select Size:
                                    </label>
                                    <select
                                        id="size-select"
                                        value={selectedSize} 
                                        onChange={(e) => setSelectedSize(e.target.value)} 
                                        className="w-full py-3 px-4 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-colors duration-200 cursor-pointer text-lg"
                                    >
                                        <option value="">-- Choose a size --</option>
                                        
                                        {product.availableSizes.map(size => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            
                            <div className="mb-6">
                                <label htmlFor="quantity-select" className="block text-gray-300 text-lg font-semibold mb-3">
                                    Quantity:
                                </label>
                                <input
                                    type="number"
                                    id="quantity-select"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-24 py-3 px-4 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-colors duration-200 text-lg"
                                />
                            </div>

                            
                            {product.sizeChartType && product.sizeChartType !== 'none' && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleOpenSizeChart}
                                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-blue-300 font-bold py-3 px-6 rounded-lg transition duration-300 text-base mb-6 shadow-md"
                                >
                                    <Ruler className="w-5 h-5 mr-2" />
                                    View {product.sizeChartType.charAt(0).toUpperCase() + product.sizeChartType.slice(1)} Size Chart
                                </motion.button>
                            )}
                        </div>

                        {addedToCartLocal ? (
                            <Link to="/cart" className="mt-6 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-xl shadow-lg">
                                <ShoppingCart className="w-6 h-6 mr-3" />
                                Go to Cart
                            </Link>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddtoCart}
                                className="mt-6 w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-xl shadow-lg"
                            >
                                <ShoppingCart className="w-6 h-6 mr-3" />
                                Add to Cart
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}

            {sizeChartOpen && product.sizeChartType && product.sizeChartType !== 'none' && (
                <SizeChartModal
                    onClose={handleCloseSizeChart}
                    sizeChartType={product.sizeChartType}
                />
            )}
        </div>
    );
}