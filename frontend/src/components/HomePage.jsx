// src/components/HomePage.jsx
import React from 'react';

const HomePage = ({ onSwitchToLogin, onSwitchToRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/Hask.png" 
                alt="Hask AI Logo" 
                className="h-8 w-8 mr-3"
              />
              <h1 className="text-2xl font-bold text-gray-900">Hask <span className="text-blue-600">AI</span></h1>
              <span className="ml-2 text-sm text-gray-500 hidden sm:inline">Your Intelligent Assistant</span>
            </div>

            <nav className="flex items-center space-x-4">
              <button
                onClick={onSwitchToLogin}
                className="px-4 py-2 text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition-colors duration-200 text-sm sm:text-base"
              >
                Sign In
              </button>
              <button
                onClick={onSwitchToRegister}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
              >
                Sign Up
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-800 mb-6 leading-tight">
            Unlock Your Potential with <br className="hidden sm:inline" />Hask AI
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            Hask AI is your all-in-one platform for cutting-edge artificial intelligence.
            From creative image generation to intelligent conversational AI, we're here to empower you.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onSwitchToRegister}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={onSwitchToLogin}
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-lg"
            >
              Already a User? Sign In
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">What Hask AI Offers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 01-5.91-4.83L5.25 12l-.91-1.92A6 6 0 0112 5.25v13.5zM12 18.75a6 6 0 005.91-4.83L18.75 12l.91-1.92A6 6 0 0012 5.25v13.5z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">Advanced Chat AI</h4>
              <p className="text-gray-600 text-center">
                Engage in dynamic conversations, get instant answers, and generate text for any purpose.
              </p>
            </div>

      
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm12.75-9h.008v.008h-.008V10.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">Stunning Image Generation</h4>
              <p className="text-gray-600 text-center">
                Create unique visuals from text descriptions or transform existing images with AI.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9.75 9.75m0 0l-1.391-.522c-.807-.302-1.711-.644-2.66-1.012M9.75 9.75L12 2.25m-2.25 7.5l-.811-.284m12.91 0l-.711-.25c-.527-.185-1.059-.426-1.569-.71L12 2.25m0 0l-8.693 4.346m8.693-4.346A7.5 7.5 0 0112 2.25v13.5m-3.75-9.75l-3.551 1.05M18.75 15.904l.811-.284m-12.91 0l-.711-.25C4.94 15.371 4.413 15.13 3.903 14.84L2.25 13.5m15 1.404l-.811-.284m-12.91 0l-.711-.25c-.527-.185-1.059-.426-1.569-.71L12 2.25m0 0l-8.693 4.346m8.693-4.346A7.5 7.5 0 0112 2.25v13.5m-3.75-9.75l-3.551 1.05M18.75 15.904l.811-.284m-12.91 0l-.711-.25C4.94 15.371 4.413 15.13 3.903 14.84L2.25 13.5m15 1.404l-.811-.284" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">Seamless Workflow</h4>
              <p className="text-gray-600 text-center">
                Integrate AI into your daily tasks with an intuitive and professional user interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Hask AI. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-400">Powered by cutting-edge AI technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;