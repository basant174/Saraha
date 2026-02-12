import React from 'react';
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center px-4
                    bg-[#062135] animate-gradient-x">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
        Welcome to Saraha
      </h1>
      <p className="text-lg md:text-2xl mb-8 drop-shadow-md">
        Share your thoughts freely or discover <br /> what others say about you anonymously
      </p>
      <Link to="/SendMessage">
        <button className="bg-[#73a9cf] hover:bg-blue-700 transform hover:scale-105 transition-all text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
          Send a Message Now
        </button>
      </Link>
    </div>
  )
}
