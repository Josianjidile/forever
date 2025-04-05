import React from 'react';
import { assets } from '../assets/assets';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 py-12 border-t border-gray-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center justify-center md:justify-start mb-4">
                            <img 
                                src={assets.logo} 
                                alt="Company Logo" 
                                className="h-10"
                            />
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Crafting quality products for a better tomorrow. We deliver excellence right to your doorstep.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center md:text-left">Quick Links</h3>
                        <ul className="space-y-2 text-center md:text-left">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Shop</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center md:text-left">Customer Service</h3>
                        <ul className="space-y-2 text-center md:text-left">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">FAQs</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Returns & Exchanges</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center md:text-left">Contact Us</h3>
                        <div className="space-y-3 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start">
                                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                <span className="text-gray-600">123 Street, City, Country</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <FaPhone className="text-gray-500 mr-2" />
                                <a href="tel:+1234567890" className="text-gray-600 hover:text-gray-900 transition-colors">+123 456 7890</a>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <FaEnvelope className="text-gray-500 mr-2" />
                                <a href="mailto:info@forever.com" className="text-gray-600 hover:text-gray-900 transition-colors">info@forever.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {currentYear} FOREVER. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;