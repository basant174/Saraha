import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../../../public/img/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const firstName = localStorage.getItem("firstName");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("gender");
    localStorage.removeItem("profileImage");

    navigate("/login");
  };

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

      {/* Links */}
      <ul className="hidden md:flex gap-14 text-gray-600 font-medium">
        <Link to="/Home">
          <li className="cursor-pointer hover:text-[#156faf] text-lg transition">
            Home
          </li>
        </Link>

        {token && (
          <Link to="/MyMessages">
            <li className="hover:text-[#156faf] cursor-pointer text-lg transition">
              Messages
            </li>
          </Link>
        )}

             {token && (
          <Link to="/FavoriteMessages">
            <li className="hover:text-[#156faf] cursor-pointer text-lg transition">
             Fav Messages
            </li>
          </Link>
        )}

        {token && (
          <Link to="/ProfileSettings">
            <li className="hover:text-[#156faf] cursor-pointer text-lg transition">
              Settings
            </li>
          </Link>
        )}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-5 mr-6">
        {!token && (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-gray-900 transition"
            >
              Login
            </Link>

            <Link
              to="/Signup"
              className="text-gray-800 hover:bg-gray-300 transition px-2 py-1 rounded"
            >
              Sign up
            </Link>
          </>
        )}

        {token && (
          <div className="relative" ref={dropdownRef}>
            
            {/* User Icon */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-700 hover:text-gray-900 transition text-lg w-9 h-9 flex justify-center items-center bg-white rounded-full"
            >
              <i className="fa-regular fa-user"></i>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                
                {/* Hello + Name */}
                <div className="px-4 pt-4 pb-1 text-[#13649e] text-[17px] font-bold">
                  Hello {firstName || "User"}  <i className="fa-regular fa-hand-spock pl-1"></i>
                </div>

                {/* Profile */}
                <Link
                  to="/ProfileSettings"
                  className="block px-4 py-2 text-gray-700 hover:text-[#156faf] transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-transparent px-4 py-2 text-gray-700 hover:text-red-700 transition rounded-b-lg"
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