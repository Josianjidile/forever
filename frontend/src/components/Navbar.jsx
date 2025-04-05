
     
     
     import React, { useContext, useState } from "react";
     import { Link, NavLink } from "react-router-dom";
     import { ShopContext } from "../context/ShopContext";
     import { 
       FiSearch, 
       FiUser, 
       FiShoppingCart, 
       FiMenu,
       FiChevronLeft,
       FiLogOut,
       FiShoppingBag,
       FiUserCheck
     } from "react-icons/fi";
     import { FaExternalLinkAlt } from "react-icons/fa";
import { assets } from "../assets/assets";
     
     const Navbar = () => {
       const { 
         setShowSearch, 
         getCartCount, 
         setToken, 
         token, 
         setCartItems, 
         navigate 
       } = useContext(ShopContext);
       
       const [menuVisible, setMenuVisible] = useState(false);
       const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
     
       const logout = () => {
         navigate('/login');
         localStorage.removeItem('token');
         setToken('');
         setCartItems({});
         setProfileDropdownVisible(false);
       };
     
       const toggleProfileDropdown = () => {
         if (token) {
           setProfileDropdownVisible(!profileDropdownVisible);
         } else {
           navigate('/login');
         }
       };
     
       const closeMobileMenu = () => setMenuVisible(false);
     
       return (
         <div className="flex items-center justify-between py-5 font-medium px-4 sm:px-6">
        {/* Logo */}
      <img  onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className="w-36 cursor-pointer" />

     
     
           {/* Navigation Links */}
           <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
             {[
               { path: "/", name: "HOME" },
               { path: "/collection", name: "COLLECTION" },
               { path: "/about", name: "ABOUT" },
               { path: "/contact", name: "CONTACT" }
             ].map((link) => (
               <NavLink 
                 key={link.path}
                 to={link.path} 
                 className="group flex flex-col items-center gap-1"
               >
                 {({ isActive }) => (
                   <>
                     <p className={`transition-colors ${isActive ? 'text-black' : 'group-hover:text-black'}`}>
                       {link.name}
                     </p>
                     <div className={`w-2/4 h-[1.5px] bg-gray-700 transition-all ${isActive ? 'scale-100' : 'scale-0 group-hover:scale-50'}`} />
                   </>
                 )}
               </NavLink>
             ))}
           </ul>
     
           {/* Search and Profile Icons */}
           <div className="flex items-center gap-6">
             {/* Admin Login Button */}
             {!token && (
               <button 
                 onClick={() => window.open("https://forever-admin-lake.vercel.app", "_blank")}
                 className="hidden sm:flex items-center gap-1 bg-black text-white px-3 py-1.5 text-sm rounded hover:bg-gray-800 transition"
               >
                 Admin <FaExternalLinkAlt className="text-xs" />
               </button>
             )}
     
             {/* Search Icon */}
             <button
               onClick={() => setShowSearch(true)}
               className="cursor-pointer"
               aria-label="Search"
             >
               <FiSearch className="w-5 h-5" />
             </button>
     
             {/* Profile Icon with Dropdown */}
             <div className="relative">
               <button
                 onClick={toggleProfileDropdown}
                 className="cursor-pointer"
                 aria-label="Profile"
               >
                 <FiUser className="w-5 h-5" />
               </button>
               
               {/* Dropdown Menu */}
               {token && profileDropdownVisible && (
                 <div 
                   className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-100"
                   onMouseLeave={() => setProfileDropdownVisible(false)}
                 >
                   <div className="flex flex-col py-2 text-gray-600">
                     <button
                       onClick={() => {
                         navigate('/profile');
                         setProfileDropdownVisible(false);
                       }} 
                       className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left"
                     >
                       <FiUserCheck className="w-4 h-4" />
                       My Profile
                     </button>
                     <button
                       onClick={() => {
                         navigate('/orders');
                         setProfileDropdownVisible(false);
                       }} 
                       className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left"
                     >
                       <FiShoppingBag className="w-4 h-4" />
                       My Orders
                     </button>
                     <button
                       onClick={logout} 
                       className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left border-t border-gray-100"
                     >
                       <FiLogOut className="w-4 h-4" />
                       Logout
                     </button>
                   </div>
                 </div>
               )}
             </div>
     
             {/* Cart Icon */}
             <Link to="/cart" className="relative" aria-label="Cart">
               <FiShoppingCart className="w-5 h-5" />
               {getCartCount() > 0 && (
                 <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-black text-white text-xs rounded-full">
                   {getCartCount()}
                 </span>
               )}
             </Link>
     
             {/* Mobile Menu Button */}
             <button
               onClick={() => setMenuVisible(true)}
               className="cursor-pointer sm:hidden"
               aria-label="Menu"
             >
               <FiMenu className="w-5 h-5" />
             </button>
           </div>
     
           {/* Mobile Menu */}
           {menuVisible && (
             <div 
               className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
               onClick={closeMobileMenu}
             />
           )}
           
           <div
             className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 sm:hidden ${
               menuVisible ? "translate-x-0" : "translate-x-full"
             }`}
           >
             <div className="flex flex-col h-full">
               <div 
                 className="flex items-center gap-4 p-4 cursor-pointer border-b"
                 onClick={closeMobileMenu}
               >
                 <FiChevronLeft className="w-5 h-5" />
                 <p className="font-medium">Close Menu</p>
               </div>
     
               <div className="flex flex-col py-2">
                 {[
                   { path: "/", name: "HOME" },
                   { path: "/collection", name: "COLLECTION" },
                   { path: "/about", name: "ABOUT" },
                   { path: "/contact", name: "CONTACT" },
                   ...(!token ? [{ path: "https://prescripto-admin-topaz.vercel.app", name: "ADMIN LOGIN", external: true }] : [])
                 ].map((link) => (
                   <NavLink
                     key={link.path}
                     onClick={closeMobileMenu}
                     className={({ isActive }) => 
                       `flex items-center gap-3 py-3 px-6 border-b ${
                         isActive ? 'text-black font-semibold' : 'text-gray-600'
                       }`
                     }
                     to={link.path}
                     target={link.external ? "_blank" : undefined}
                   >
                     {link.external && <FaExternalLinkAlt className="text-xs" />}
                     {link.name}
                   </NavLink>
                 ))}
                 
                 {token && (
                   <button
                     onClick={() => {
                       logout();
                       closeMobileMenu();
                     }} 
                     className="flex items-center gap-3 py-3 px-6 border-b text-gray-600 text-left"
                   >
                     <FiLogOut className="w-4 h-4" />
                     LOGOUT
                   </button>
                 )}
               </div>
             </div>
           </div>
         </div>
       );
     };
     
     export default Navbar;