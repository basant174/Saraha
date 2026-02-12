import { Link, useNavigate } from "react-router-dom";
import logo from "../../../public/img/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-[#e7e7e7] px-8 py-3 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-2 ml-8">
        <Link to="/">
          <img src={logo} alt="Saraha Logo" className="w-32 h-auto" />
        </Link>
      </div>

      {/* Center Links */}
      <ul className="hidden md:flex gap-8 text-gray-600 font-medium">

        {/* Home تظهر دايمًا */}
        <Link to="/Home">
          <li className="hover:text-gray-900 cursor-pointer transition">
            Home
          </li>
        </Link>

        {/* باقي اللينكات تظهر بس لو عامل Login */}
        {token && (
          <>
            <Link to="/SendMessage">
              <li className="hover:text-gray-900 cursor-pointer transition">
                Send Message
              </li>
            </Link>

            <Link to="/MyMessages">
              <li className="hover:text-gray-900 cursor-pointer transition">
                My Messages
              </li>
            </Link>
          </>
        )}

      </ul>

      {/* Right Auth */}
      <div className="flex items-center gap-5 mr-6">

        {/* لو مش عامل Login */}
        {!token && (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-gray-900 transition"
            >
              Login
            </Link>

            <Link
              to="/"
              className="text-gray-800 hover:bg-gray-300 transition px-2 py-1 rounded"
            >
              Sign up
            </Link>
          </>
        )}

        {/* لو عامل Login */}
        {token && (
          <div className="flex items-center gap-3">
            
            {/* Profile Icon */}
            <Link
              to="/ProfileSettings"
              className="text-gray-700 hover:text-gray-900 transition text-lg w-9 h-9 flex justify-center items-center bg-white rounded-full"
            >
              <i className="fa-regular fa-user"></i>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-sky-500 text-lg hover:text-sky-700 transition px-2 py-1 rounded bg-[#e7e7e7]"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        )}

      </div>

    </nav>
  );
}
