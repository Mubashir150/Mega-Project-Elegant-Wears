import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProducts} from "../slice/productSlice";
import { addToCart } from "../slice/cartSlice";


export default function SelectedCategory() {
 
  const { category } = useParams();
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  function handleAddtoCart(product){
    const itemToAdd = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl, 
        quantity: 1,
    };
    console.log("Item to send to backend:", itemToAdd);
    dispatch(addToCart(itemToAdd))
}

  const [sortBy,setSortBy]=useState("")
  useEffect(() => {
    
    dispatch(fetchProducts({category:category||"All", sort:sortBy}));

  }, [category, dispatch,sortBy]);

  function handleSortChange(e){
    setSortBy(e.target.value);
  }

  

  if (status === "loading") return <p className="text-center py-8 text-gray-400">Loading products...</p>;
  if (status === "failed") return <p className="text-center py-8 text-red-500">Error loading products: {error}</p>;

  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-300 mb-6 text-center">{category.toUpperCase()}</h1>
        <div className="flex justify-end mb-8">
          <label htmlFor="sort-select" className="mr-3 text-lg font-medium text-gray-300">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy} 
            onChange={handleSortChange}
            className="p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
          >
            <option value="">Default</option> 
            <option value="price_asc">Price: Low to High</option>
            <option value="price_des">Price: High to Low</option> 
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col transition duration-300 ease-in-out hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
            >
              <div className="relative h-72">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 truncate mb-2 text-center">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 text-center">
                    {product.description}
                  </p>
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <p className="text-xl font-bold text-indigo-400 mb-2">${product.price}</p>
                  <div className="flex gap-2">
                    <Link to={`/products/${category}/${product._id}`}><button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200" >
                      View Details
                    </button></Link>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                    onClick={()=>handleAddtoCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}