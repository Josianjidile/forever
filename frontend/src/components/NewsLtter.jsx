import React from 'react';

const NewsLetter = () => {
    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-medium text-gray-900 sm:text-4xl">
                    Subscribe Now & get 20% off 
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    Stay updated with the latest news, exclusive offers, and special promotions delivered straight to your inbox.
                </p>
                <div className="mt-8 sm:mx-auto sm:max-w-md">
                    <form className="sm:flex">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="w-full px-5 py-3 placeholder-gray-900 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-blue-500 sm:max-w-xs"
                            placeholder="Enter your email"
                        />
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Subscribe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewsLetter;