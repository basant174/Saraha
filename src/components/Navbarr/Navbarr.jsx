import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../../../public/img/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#e7e7e7] px-8 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center gap-2 ml-8">
        <Link to="/">
          <img src={logo} alt="Saraha Logo" className="w-32 h-auto" />
        </Link>
      </div>

      {/* Center Links */}
      <ul className="hidden md:flex gap-8 text-gray-600 font-medium">
        <Link to="/Home">
          <li className="hover:text-gray-900 cursor-pointer transition">Home</li>
        </Link>

        
      </ul>

      {/* Right Auth */}
      <div className="flex items-center gap-5 mr-6">
        {!token && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-gray-900 transition">Login</Link>
            <Link to="/" className="text-gray-800 hover:bg-gray-300 transition px-2 py-1 rounded">Sign up</Link>
          </>
        )}

        {token && (
          <div className="relative" ref={dropdownRef}>
            {/* Profile Icon */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-700 hover:text-gray-900 transition text-lg w-9 h-9 flex justify-center items-center bg-white rounded-full"
            >
              <i className="fa-regular fa-user"></i>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <Link
                  to="/ProfileSettings"
                  className="block px-4 py-2 text-gray-700 hover:bg-sky-100 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                Profile
                </Link>



                
                <Link
                  to="/MyMessages"
                  className="block px-4 py-2 text-gray-700 hover:bg-sky-100 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Messages
                </Link>


                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 bg-transparent hover:text-red-700 transition rounded-b-lg"
                >

                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
