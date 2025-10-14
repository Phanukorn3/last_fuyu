import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbaruser() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const userName = "Fuyu Taro";

  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/");
      navigate("/login");
    } catch (error) {
      console.error("การออกจากระบบล้มเหลว:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <nav className="bg-gray-100 shadow-md px-6 py-6 flex justify-end">
      </nav>
      <nav className="bg-white shadow-md px-6 py-12 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/iconindex.svg" alt="Icon" className="w-20 h-20 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">FuyuShop</h1>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="flex items-center space-x-3 focus:outline-none"
          >
            <span className="text-gray-700 font-medium hidden md:block">{userName}</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
              <Link
                to="/user/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
