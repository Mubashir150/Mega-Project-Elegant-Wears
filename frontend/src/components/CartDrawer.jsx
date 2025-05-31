import { useSelector,useDispatch } from "react-redux"
import { closeCartDrawer,removeFromCart,updateCartQuantity,clearCart,clearCartLocal} from "../slice/cartSlice"
import { useNavigate } from "react-router-dom";
export default function CartDrawer(){
    const dispatch=useDispatch();
    const {items,isDrawerOpen}=useSelector((state)=>state.cart)
    const user= useSelector((state)=>state.auth.user)
    const navigate=useNavigate()

    function handleNavigate(){
      dispatch(closeCartDrawer())
      navigate("/products/checkout")
    }

    const calculateTotal=()=>{
        return items.reduce((acc,item)=>acc+item.price*item.quantity,0).toFixed(2);
    };
    const handleRemoveItem = (productId) => {
      dispatch(removeFromCart(productId));
  };
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1){
      dispatch(removeFromCart(item.productId))
      return; 
    }

    dispatch(updateCartQuantity({
        productId: item.productId,
        quantity: newQuantity,
        name: item.name, 
        price: item.price,
        image: item.imageUrl,
    }));
};

const handleClearAllItems = () => {
  if (window.confirm("Are you sure you want to clear your entire cart? This action cannot be undone.")) {
      if (user) {
          // If user is authenticated, clear the backend cart
          dispatch(clearCart());
      } else {
          // If user is a guest, clear the local storage cart
          dispatch(clearCartLocal());
      }
      dispatch(closeCartDrawer()); 
  }
};
    if(!isDrawerOpen){
        return null;
    }
    return (
        <>
        <div
        className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ease-in-out"
        onClick={() => dispatch(closeCartDrawer())}
      ></div>

      
      <div
        className={`fixed top-0 right-0 w-80 md:w-96 h-full bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700 flex-shrink-0 ">
          <h2 className="text-xl font-bold text-gray-200">Your Cart</h2>
          <button
            onClick={() => dispatch(closeCartDrawer())}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow min-h-0"> 
          {items.length === 0 ? (
            <p className="text-gray-400 text-center mt-8">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-700 last:border-b-0">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded" />
                <div className="flex-grow">
                  <h3 className="text-md font-semibold text-gray-200">{item.name}</h3>
                  <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-1">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="bg-gray-700 text-gray-200 px-2 py-0.5 rounded-l hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="bg-gray-700 text-gray-200 px-3 py-0.5">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="bg-gray-700 text-gray-200 px-2 py-0.5 rounded-r hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-red-500 hover:text-red-400 focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex-shrink-0">
        {items.length > 0 && ( 
                        <button
                            onClick={handleClearAllItems}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 mb-2"
                        >
                            Clear Entire Cart
                        </button>
                    )}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-gray-200">Total:</span>
            <span className="text-xl font-bold text-indigo-400">${calculateTotal()}</span>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-md transition duration-200" onClick={handleNavigate}>
            Proceed to Checkout
          </button>
        </div>
      </div>
        </>
    )
}