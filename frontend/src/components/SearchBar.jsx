import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    // Update visibility based on route and showSearch state
    useEffect(() => {
        if (location.pathname.includes("collection") && showSearch) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location, showSearch]);

    // Close the search bar
    const handleClose = () => {
        setShowSearch(false);
        setSearch(""); // Clear the search input when closing
    };

    return showSearch && visible ? (
        <div className="border-t border-b bg-gray-50 py-4 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center">
                    {/* Search Input */}
                    <div className="relative flex items-center w-full max-w-md">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
                            placeholder="Search products..."
                            type="text"
                            aria-label="Search"
                        />
                        {/* Search Icon */}
                        <img
                            src={assets.search_icon}
                            className="absolute left-3 w-4 h-4 text-gray-400"
                            alt="Search"
                        />
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="ml-4 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200"
                        aria-label="Close search bar"
                    >
                        <img src={assets.cross_icon} className="w-4 h-4" alt="Close" />
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default SearchBar;