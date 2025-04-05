import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="px-4 sm:px-8 py-12 bg-gray-50">
      {/* Title Section */}
      <div className="text-center">
        <Title text1={"CONTACT"} text2={"US"} />
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Have questions or need assistance? We're here to help! Reach out to us
          anytime.
        </p>
      </div>

      {/* Image and Content Grid */}
      <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={assets.contact_img}
            alt="Contact Us"
            className="w-full max-w-md rounded-lg shadow-md"
          />
        </div>

        {/* Contact Form Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Get in Touch
          </h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mt-16 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Contact Information
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800">Email</h3>
            <p className="mt-2 text-gray-600">support@example.com</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800">Phone</h3>
            <p className="mt-2 text-gray-600">+1 (123) 456-7890</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800">Address</h3>
            <p className="mt-2 text-gray-600">
              123 Main Street, City, Country
            </p>
          </div>
        </div>
      </div>

      {/* Career at Forever Section */}
      <div className="mt-16 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Career at Forever
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Join our team and be a part of something extraordinary. We're always
          looking for talented individuals to help us grow and innovate.
        </p>
        <button
          onClick={() => {
            // Add functionality to redirect to the careers page
            window.location.href = "#";
          }}
          className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Explore Jobs
        </button>
      </div>
    </div>
  );
};

export default Contact;