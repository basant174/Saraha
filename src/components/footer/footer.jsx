import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGoogle } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#e7e7e7] text-gray-300 py-5">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-xl font-bold mb-2 sm:mb-0 text-black hover:text-[#2c7db7] transition-all">
          Saraha
        </div>

        <div className="text-sm text-[#2c7db7] mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()} Saraha. All rights reserved.
        </div>   
        <div className="flex gap-4 text-gray-400">
          <a href="#" className="hover:text-[#2c7db7] transition-all"><FaFacebookF /></a>
          <a href="#" className="hover:text-[#2c7db7] transition-all"><FaTwitter /></a>
          <a href="#" className="hover:text-[#2c7db7] transition-all"><FaLinkedinIn /></a>
          <a href="#" className="hover:text-[#2c7db7] transition-all"><FaGoogle /></a>
        </div>
      </div>
    </footer>
  );
}
