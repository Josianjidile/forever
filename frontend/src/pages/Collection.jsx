import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState("relevant");

    // Toggle category filter
    const toggleCategory = (e) => {
        setCategory((prev) =>
            prev.includes(e.target.value)
                ? prev.filter((item) => item !== e.target.value)
                : [...prev, e.target.value]
        );
    };

    // Toggle subcategory filter
    const toggleSubCategory = (e) => {
        setSubCategory((prev) =>
            prev.includes(e.target.value)
                ? prev.filter((item) => item !== e.target.value)
                : [...prev, e.target.value]
        );
    };

    // Apply filters and search
    const applyFilter = () => {
        if (!products) return; // Prevent errors if products is undefined
        let productsCopy = [...products];

        // Apply search filter
        if (showSearch && search) {
            productsCopy = productsCopy.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply category filter
        if (category.length > 0) {
            productsCopy = productsCopy.filter((item) => category.includes(item.category));
        }

        // Apply subcategory filter
        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
        }

        setFilteredProducts(productsCopy);
    };

    // Sort products
    const sortProducts = () => {
        if (!filteredProducts.length) return;
        let sortedProducts = [...filteredProducts];

        switch (sortType) {
            case "low-to-high":
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case "high-to-low":
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        setFilteredProducts(sortedProducts);
    };

    // Apply filters when category, subCategory, or products change
    useEffect(() => {
        if (products) {
            applyFilter();
        }
    }, [category, subCategory, products, search]);

    // Sort products when sortType changes
    useEffect(() => {
        sortProducts();
    }, [sortType]);

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            {/* Filter options */}
            <div className="min-w-60">
                <p
                    className="my-2 text-xl flex items-center cursor-pointer sm:cursor-auto"
                    onClick={() => setShowFilter(!showFilter)}  
                >
                    Filters
                    <img
                        src={assets.dropdown_icon}
                        alt="Dropdown Icon"
                        className={`ml-2 w-4 h-4 transition-transform duration-300 sm:hidden ${
                            showFilter ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                </p>

                {/* Category filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>

                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        {["Men", "Women", "Kids"].map((cat) => (
                            <label key={cat} className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    className="w-3"
                                    value={cat}
                                    onChange={toggleCategory}
                                    checked={category.includes(cat)}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Type filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        {["Topwear", "Bottomwear", "Winterwear"].map((subCat) => (
                            <label key={subCat} className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    className="w-3"
                                    value={subCat}
                                    onChange={toggleSubCategory}
                                    checked={subCategory.includes(subCat)}
                                />
                                {subCat}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product list */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                    <Title text1={'ALL'} text2={'COLLECTIONS'} />
                    {/* Product sort */}
                    <select
                        className="border-2 border-gray-300 text-sm px-2 py-1"
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                    >
                        <option value="relevant">Sort by: Relevant</option>
                        <option value="low-to-high">Sort by: Low to High</option>
                        <option value="high-to-low">Sort by: High to Low</option>
                    </select>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <ProductItem
                                key={item.id}
                                id={item._id}
                                image={item.image}
                                name={item.name}
                                price={item.price}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Collection;