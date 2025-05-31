// src/components/Categories.jsx
import { Link } from "react-router-dom";

export default function Categories() {
    const categories = [
        { name: "Coats", image: "images/ct1.jpeg" },
        { name: "Jackets", image: "images/jt.jpeg" },
        { name: "Sweaters", image: "images/st.jpeg" }
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-6 max-w-7xl mx-auto"> 
            {categories.map((category, index) => (
                <Link
                    to={`/products/${category.name}`}
                    key={index}
                    className="relative group overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1" 
                >
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-90 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out brightness-75 group-hover:brightness-100" // Image styling
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent flex flex-col items-start justify-end p-6"> 
                        <h2 className="text-3xl font-bold text-white mb-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                            {category.name}
                        </h2>
                        <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            Explore our {category.name.toLowerCase()} collection.
                        </p>
                    </div>
                </Link>
            ))}
        </section>
    );
}