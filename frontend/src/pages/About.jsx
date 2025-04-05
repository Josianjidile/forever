import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";

import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"; // Import icons
import NewsLetter from "../components/NewsLtter";

const About = () => {
  return (
    <div className="px-4 sm:px-8 py-12 bg-gray-50">
      {/* Title Section */}
      <div className="text-center">
        <Title text1={"ABOUT"} text2={"US"} />
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Discover the story behind our brand and what makes us unique.
        </p>
      </div>

      {/* Image and Content Grid */}
      <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={assets.about_img}
            alt="About Us"
            className="w-full max-w-md rounded-lg shadow-md"
          />
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We are a passionate team dedicated to delivering high-quality products
            and exceptional customer experiences. Our mission is to make your
            shopping journey seamless and enjoyable.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To provide innovative, sustainable, and affordable solutions that
            enhance your everyday life. We believe in quality, transparency, and
            customer satisfaction.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Premium quality products</li>
            <li>Fast and reliable shipping</li>
            <li>Eco-friendly and sustainable practices</li>
            <li>24/7 customer support</li>
          </ul>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 text-center bg-white py-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800">
          Join Our Community
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Follow us on social media to stay updated on the latest products,
          promotions, and news.
        </p>
        <div className="mt-6 flex justify-center gap-6">
          <a
            href="https://facebook.com" // Replace with your Facebook link
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaFacebook className="text-3xl" />
          </a>
          <a
            href="https://twitter.com" // Replace with your Twitter link
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-400 transition-colors"
          >
            <FaTwitter className="text-3xl" />
          </a>
          <a
            href="https://instagram.com" // Replace with your Instagram link
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            <FaInstagram className="text-3xl" />
          </a>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-16 max-w-2xl mx-auto">
        <NewsLetter/>
      </div>
    </div>
  );
};

export default About;