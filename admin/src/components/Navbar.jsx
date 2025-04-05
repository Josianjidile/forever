import React from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50">
      {/* Left Section - Logo and User Badge */}
      <div className="flex items-center gap-4">
        <img 
          src={assets.logo} 
          alt="App Logo" 
          className="w-32 h-auto cursor-pointer"
          onClick={() => navigate('/list')}
        />
      </div>

      {/* Right Section - Logout Button with confirmation */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            if(window.confirm("Are you sure you want to logout?")) {
              handleLogout();
            }
          }}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
              clipRule="evenodd" 
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;