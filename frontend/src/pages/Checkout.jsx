
import { useState } from "react"
import { useSelector,useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { clearCart } from "../slice/cartSlice";
import { placeOrder,resetCheckout } from "../slice/checkoutSlice";
import toast from "react-hot-toast";


export default function Checkout(){
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const cartItems=useSelector((state)=>state.cart.items);
    const [discountInput,setDiscountInput]=useState('');
    const [discountCodePercentage,setDiscountCodePercentage]=useState(0);
    const [discountMessage,setDiscountMessage]=useState("");
    console.log("Cart Items in Checkout:", cartItems);
    const {orderStatus,orderError}=useSelector((state)=>state.checkout)

    

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        paymentMethod: 'COD', 
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    })

    const calculateTotal=()=>{
        return cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0).toFixed(2)
    }
    const handleDiscount=()=>{
      if(discountInput==="E15"){
        setDiscountCodePercentage(0.15)
        setDiscountMessage('Discount "E15" applied successfully! You get 15% off.')
      }
      else{
        setDiscountCodePercentage(0)
        setDiscountMessage("Invalid code")
      }
    }

    const calculateFinalTotal = () => {
      const subtotal = calculateTotal();
      const discountAmount = subtotal * discountCodePercentage;
      return (subtotal - discountAmount).toFixed(2); 
  };
    const handleInputChange=(e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value})
    }
    const handlePlaceOrder=async(e)=>{
        e.preventDefault();
        if(cartItems.length===0){
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }
        const itemsForOrder=cartItems.map(item=>({
            productId:item.productId,
            quantity:item.quantity,
        }))
        const orderDetails = {
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            paymentMethod: formData.paymentMethod,
            cartItems: itemsForOrder,
            paymentToken: formData.paymentMethod === 'Card' ? 'mock_card_token_123' : null,
            discountCode: discountInput
        }
        const resultAction= await dispatch(placeOrder(orderDetails));
        if(placeOrder.fulfilled.match(resultAction)){
            alert("Order placed successfully");
            dispatch(clearCart());
            dispatch(resetCheckout());
            navigate("/products")
            toast.success("Order placed successfully")
        }
        else{
            alert(`Failed to place order: ${orderError|| "Unknown Error"}`)
        }

    }

    return (
        <div className="bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-gray-200">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-400">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4 border-b border-gray-700 pb-4 last:border-b-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-md" />
                      <div className="flex-grow">
                        <h3 className="text-md font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-400">${item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      <span className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-indigo-400">${calculateTotal()}</span>
                </div>
                {discountCodePercentage>0 && (
                  <div className="mt-2 flex justify-between items-center text-green-400">
                  <span className="text-md">Discount ({discountCodePercentage * 100}%):</span>
                  <span className="text-md">-${(calculateTotal() * discountCodePercentage).toFixed(2)}</span>
              </div>
                )}
                <div className="mt-6"> 
                            <span className="block text-lg font-semibold mb-2">Discount Code</span> 
                            <div className="flex"> 
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="flex-grow bg-gray-700 text-gray-200 border border-gray-600 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    aria-label="Discount Code" 
                                    onChange={(e)=>setDiscountInput(e.target.value.toUpperCase())}
                                />
                                <button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800" onClick={handleDiscount}
                                >
                                    Apply
                                </button>
                            </div>
                            {discountMessage && (
                                        <p className={`text-sm mt-2 ${discountCodePercentage > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {discountMessage}
                                        </p>
                                    )}
                           
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                                    <span className="text-xl font-bold">Grand Total:</span>
                                    <span className="text-2xl font-bold text-indigo-400">${calculateFinalTotal()}</span>
                                </div>
              </>
            )}
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Shipping Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
              ></textarea>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
              />
            </div>

            <h2 className="text-2xl font-semibold mb-4 pt-4 border-t border-gray-700">Payment Method</h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleInputChange}
                  className="form-radio text-indigo-600 h-4 w-4"
                />
                <span className="ml-2 text-gray-300">Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={formData.paymentMethod === 'Card'}
                  onChange={handleInputChange}
                  className="form-radio text-indigo-600 h-4 w-4"
                />
                <span className="ml-2 text-gray-300">Credit/Debit Card</span>
              </label>
            </div>

            {formData.paymentMethod === 'Card' && (
              <div className="space-y-4 bg-gray-700 p-4 rounded-md">
                <p className="text-sm text-red-400">
                  * For a real app, use a secure payment gateway (e.g., Stripe Elements) instead of direct inputs.
                </p>
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required={formData.paymentMethod === 'Card'}
                    className="w-full p-3 rounded-md bg-gray-600 border border-gray-500 focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                    placeholder="XXXX XXXX XXXX XXXX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-1">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required={formData.paymentMethod === 'Card'}
                      className="w-full p-3 rounded-md bg-gray-600 border border-gray-500 focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-1">CVC</label>
                    <input
                      type="text"
                      id="cvc"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      required={formData.paymentMethod === 'Card'}
                      className="w-full p-3 rounded-md bg-gray-600 border border-gray-500 focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                      placeholder="XXX"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-md transition duration-200 focus:outline-none focus:shadow-outline"
              disabled={orderStatus === 'loading' || cartItems.length === 0}
            >
              {orderStatus === 'loading' ? 'Placing Order...' : 'Place Order'}
            </button>

            {orderError && (
              <p className="text-red-500 text-center mt-4">{orderError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
    )
}