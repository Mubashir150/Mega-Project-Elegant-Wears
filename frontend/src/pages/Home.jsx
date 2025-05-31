// src/pages/Home.jsx
import Categories from "../components/Categories";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
            
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: "url('/images/p4.jpg')",
                    backgroundSize: "cover",
                    backgroundRepeat: "repeat",
                }}
            ></div>

            <div className="relative z-10 py-10"> 
                <h1 className="font-extrabold text-center text-5xl text-blue-400 mt-10 tracking-wider drop-shadow-md">
                    Our Collections
                </h1>
                <p className="text-center text-gray-400 text-lg mt-4 mb-12 max-w-2xl mx-auto">
                    Discover quality apparel and elevate your style.
                </p>

                <Categories />
            </div>
        </div>
    );
}